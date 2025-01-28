class GeneticAlgorithm {
  constructor(
    batches,
    halls,
    lecturers,
    populationSize,
    mutationRate,
    generations
  ) {
    //accesing objects
    this.batches = batches;
    this.halls = halls;
    this.lecturers = lecturers;
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.generations = generations;
    this.population = [];
  }

  initializePopulation() {
    // Generate initial population
    for (let i = 0; i < this.populationSize; i++) {
      const timetable = this.generateRandomTimetable();
      this.population.push(timetable);
    }
  }
  // a 2d array to represent the days of the week and 8 slots
  generateRandomTimetable() {
    const timetable = {};
    const hallUsage = Array.from({ length: 5 }, () =>
      Array.from({ length: 8 }, () => new Set())
    );
    const lecturerUsage = Array.from({ length: 5 }, () =>
      Array.from({ length: 8 }, () => new Set())
    );

    for (const batch of this.batches) {
      timetable[batch.name] = Array.from({ length: 5 }, () =>
        Array(8).fill(null)
      );
    }

    for (const batch of this.batches) {
      for (let day = 0; day < 5; day++) {
        for (let slot = 0; slot < 8; slot += 2) {
          if (Math.random() > 0.5) {
            // 50% chance of free slot
            const availableHalls = this.halls.filter(
              (h) =>
                !hallUsage[day][slot].has(h.name) &&
                !hallUsage[day][slot + 1].has(h.name)
            );

            const availableLecturers = this.lecturers.filter(
              (l) =>
                !lecturerUsage[day][slot].has(l.name) &&
                !lecturerUsage[day][slot + 1].has(l.name)
            );
            //Proceeds only if there is at least one available hall and lecturer.

            if (availableHalls.length > 0 && availableLecturers.length > 0) {
              const hall =
                availableHalls[
                  Math.floor(Math.random() * availableHalls.length)
                ];
              const lecturer =
                availableLecturers[
                  Math.floor(Math.random() * availableLecturers.length)
                ];
              const course =
                batch.courses[Math.floor(Math.random() * batch.courses.length)];

              timetable[batch.name][day][slot] = { course, hall, lecturer };
              timetable[batch.name][day][slot + 1] = { course, hall, lecturer };

              hallUsage[day][slot].add(hall.name);
              hallUsage[day][slot + 1].add(hall.name);
              lecturerUsage[day][slot].add(lecturer.name);
              lecturerUsage[day][slot + 1].add(lecturer.name);
            }
          }
        }
      }
    }

    return timetable;
  }

  fitnessFunction(timetable) {
    let fitness = 0;
    const hallUsage = Array.from({ length: 5 }, () =>
      Array.from({ length: 8 }, () => new Set())
    );
    const lecturerUsage = Array.from({ length: 5 }, () =>
      Array.from({ length: 8 }, () => new Set())
    );

    for (const batch in timetable) {
      for (let day = 0; day < 5; day++) {
        for (let slot = 0; slot < 8; slot++) {
          const schedule = timetable[batch][day][slot];
          if (schedule) {
            // Check hall conflicts
            if (hallUsage[day][slot].has(schedule.hall.name)) {
              fitness -= 100;
            } else {
              hallUsage[day][slot].add(schedule.hall.name);
              fitness += 1;
            }

            // Check lecturer conflicts
            if (lecturerUsage[day][slot].has(schedule.lecturer.name)) {
              fitness -= 100;
            } else {
              lecturerUsage[day][slot].add(schedule.lecturer.name);
              fitness += 1;
            }

            // Check hall capacity
            const hall = this.halls.find((h) => h.name === schedule.hall.name);
            if (hall) {
              const hallCapacity = hall.capacity;
              const batchSize = this.batches.find((b) => b.name === batch).size;
              if (hallCapacity >= batchSize) fitness++;
            }

            // Check lecturer availability
            const lecturer = this.lecturers.find(
              (l) => l.name === schedule.lecturer.name
            );
            if (lecturer) {
              const lecturerCourses = lecturer.courses;
              if (lecturerCourses.includes(schedule.course)) fitness++;
            }
          }
        }
      }
    }
    return fitness;
  }

  selection() {
    // Select the best solutions
    this.population.sort(
      (a, b) => this.fitnessFunction(b) - this.fitnessFunction(a)
    );
    return this.population.slice(0, this.populationSize / 2);
  }

  crossover(parent1, parent2) {
    const offspring = {};
    for (const batch in parent1) {
      offspring[batch] = [];
      for (let day = 0; day < 5; day++) {
        const daySchedule = [];
        for (let slot = 0; slot < 8; slot++) {
          const gene1 = parent1[batch][day] ? parent1[batch][day][slot] : null;
          const gene2 = parent2[batch][day] ? parent2[batch][day][slot] : null;
          const gene = Math.random() > 0.5 ? gene1 : gene2;
          daySchedule.push(gene);
        }
        offspring[batch].push(daySchedule);
      }
    }
    return offspring;
  }

  mutate(timetable) {
    const hallUsage = Array.from({ length: 5 }, () =>
      Array.from({ length: 8 }, () => new Set())
    );
    const lecturerUsage = Array.from({ length: 5 }, () =>
      Array.from({ length: 8 }, () => new Set())
    );

    // First pass: record current hall usage
    for (const batch in timetable) {
      for (let day = 0; day < 5; day++) {
        for (let slot = 0; slot < 8; slot++) {
          const schedule = timetable[batch][day][slot];
          if (schedule) {
            hallUsage[day][slot].add(schedule.hall.name);
            lecturerUsage[day][slot].add(schedule.lecturer.name);
          }
        }
      }
    }

    // Second pass: perform mutations
    for (const batch in timetable) {
      for (let day = 0; day < 5; day++) {
        for (let slot = 0; slot < 8; slot++) {
          if (Math.random() < this.mutationRate) {
            const currentSchedule = timetable[batch][day][slot];

            // Chance to create a free slot i assumed 30%
            if (Math.random() < 0.3) {
              if (currentSchedule) {
                hallUsage[day][slot].delete(currentSchedule.hall.name);
                lecturerUsage[day][slot].delete(currentSchedule.lecturer.name);
              }
              timetable[batch][day][slot] = null;
              continue;
            }

            // Try to assign a new schedule
            const availableHalls = this.halls.filter(
              (h) => !hallUsage[day][slot].has(h.name)
            );
            const availableLecturers = this.lecturers.filter(
              (l) => !lecturerUsage[day][slot].has(l.name)
            );
            //check aailability of the halls and lecturers
            if (availableHalls.length > 0 && availableLecturers.length > 0) {
              const hall =
                availableHalls[
                  Math.floor(Math.random() * availableHalls.length)
                ];
              const lecturer =
                availableLecturers[
                  Math.floor(Math.random() * availableLecturers.length)
                ];
              const batchObj = this.batches.find((b) => b.name === batch);
              const course =
                batchObj.courses[
                  Math.floor(Math.random() * batchObj.courses.length)
                ];

              if (currentSchedule) {
                hallUsage[day][slot].delete(currentSchedule.hall.name);
                lecturerUsage[day][slot].delete(currentSchedule.lecturer.name);
              }

              timetable[batch][day][slot] = { course, hall, lecturer };
              hallUsage[day][slot].add(hall.name);
              lecturerUsage[day][slot].add(lecturer.name);
            }
          }
        }
      }
    }
  }

  run() {
    this.initializePopulation();
    for (let generation = 0; generation < this.generations; generation++) {
      const selected = this.selection();
      const newPopulation = [];
      while (newPopulation.length < this.populationSize) {
        const parent1 = selected[Math.floor(Math.random() * selected.length)];
        const parent2 = selected[Math.floor(Math.random() * selected.length)];
        const offspring = this.crossover(parent1, parent2);
        this.mutate(offspring);
        newPopulation.push(offspring);
      }
      this.population = newPopulation;
    }
    return this.population[0];
  }
}

// Example usage
const batches = [
  { name: "2019", size: 77, courses: ["CS3213", "CS3211", "EO3205"] },
  { name: "2020", size: 80, courses: ["CS2101", "CS2102", "CS2103"] },
  { name: "2021", size: 85, courses: ["CS1113", "CS1102", "CS1103"] },
];

const halls = [
  { name: " hall 01", capacity: 90 },
  { name: " hall 02", capacity: 100 },
  { name: " hall 03", capacity: 95 },
];

const lecturers = [
  { name: "Ms T.Thanusiya", courses: ["CS3213T", "CS2101T", "CS1113T"] },
  { name: "Ms Khethika", courses: ["CS3211J", "CS2102J", "CS1102J"] },
  { name: "Mrs Thatchanamoorthi", courses: ["EO3205S", "CS2103S", "CS1103S"] },
];

const ga = new GeneticAlgorithm(batches, halls, lecturers, 100, 0.01, 1000);
const bestTimetable = ga.run();

function displayTimetable(timetable) {
  for (const batch in timetable) {
    console.log(`\nTimetable for Batch: ${batch}`);
    console.log(
      "Slot\t\tMonday\t\t\tTuesday\t\t\tWednesday\t\tThursday\t\tFriday"
    );
    for (let slot = 0; slot < 8; slot++) {
      let row = `${slot + 1}\t`;
      for (let day = 0; day < 5; day++) {
        const schedule = timetable[batch][day][slot];
        if (schedule) {
          row += `${schedule.course} (${schedule.hall.name})\t`;
        } else {
          row += `\t\t\t`;
        }
      }
      console.log(row);
    }
  }
}

displayTimetable(bestTimetable);

//fitness function
// Correct hall usage (+1).
// Correct lecturer usage (+1).
// Hall capacity satisfied (+1).
// Lecturer qualified to teach the course (+1).
//hall confilcts
//lecture conflicts
