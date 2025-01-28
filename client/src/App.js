import React, { useState } from "react";
import "./App.css";

function App() {
  const [schedule, setSchedule] = useState(null);
  const [lecturers, setLecturers] = useState([{ name: "", courses: "" }]);
  const [halls, setHalls] = useState([{ name: "", capacity: "" }]);
  const [batches, setBatches] = useState([{ name: "", size: "", courses: "" }]);

  const handleLecturerChange = (index, event) => {
    const newLecturers = [...lecturers];
    newLecturers[index][event.target.name] = event.target.value;
    setLecturers(newLecturers);
  };

  const handleHallChange = (index, event) => {
    const newHalls = [...halls];
    newHalls[index][event.target.name] = event.target.value;
    setHalls(newHalls);
  };

  const handleBatchChange = (index, event) => {
    const newBatches = [...batches];
    newBatches[index][event.target.name] = event.target.value;
    setBatches(newBatches);
  };

  const addLecturer = () =>
    setLecturers([...lecturers, { name: "", courses: "" }]);
  const addHall = () => setHalls([...halls, { name: "", capacity: "" }]);
  const addBatch = () =>
    setBatches([...batches, { name: "", size: "", courses: "" }]);

  const submitDetails = async () => {
    try {
      // Update lecturers
      await fetch("http://localhost:8000/scheduler/lecturers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lecturers: lecturers.map((l) => ({
            ...l,
            courses: l.courses.split(",").map((c) => c.trim()),
          })),
        }),
      });

      // Update halls
      await fetch("http://localhost:8000/scheduler/halls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          halls: halls.map((h) => ({
            ...h,
            capacity: parseInt(h.capacity),
          })),
        }),
      });

      // Update batches
      await fetch("http://localhost:8000/scheduler/batches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batches: batches.map((b) => ({
            ...b,
            size: parseInt(b.size),
            courses: b.courses.split(",").map((c) => c.trim()),
          })),
        }),
      });

      // Generate timetable
      const response = await fetch("http://localhost:8000/scheduler/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setSchedule(data.data);
      } else {
        alert("Error generating timetable: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error communicating with server");
    }
  };

  if (!schedule) {
    return (
      <div className="App">
        <div className="heading">
          <h1>Resource Allocation System</h1>
        </div>
        <div className="lecturer">
          <h2>Lecturers</h2>
          {lecturers.map((lecturer, index) => (
            <div key={index}>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Name"
                value={lecturer.name}
                onChange={(event) => handleLecturerChange(index, event)}
              />
              <input
                className="input"
                type="text"
                name="courses"
                placeholder="Courses (comma separated)"
                value={lecturer.courses}
                onChange={(event) => handleLecturerChange(index, event)}
              />
            </div>
          ))}
          <button className="button" onClick={addLecturer}>
            Add Lecturer
          </button>
        </div>
        <div className="halls">
          <h2>Halls</h2>
          {halls.map((hall, index) => (
            <div key={index}>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Name"
                value={hall.name}
                onChange={(event) => handleHallChange(index, event)}
              />
              <input
                className="input"
                type="text"
                name="capacity"
                placeholder="Capacity"
                value={hall.capacity}
                onChange={(event) => handleHallChange(index, event)}
              />
            </div>
          ))}
          <button className="button" onClick={addHall}>
            Add Hall
          </button>
        </div>
        <div className="batches">
          <h2>Batches</h2>
          {batches.map((batch, index) => (
            <div key={index}>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Name"
                value={batch.name}
                onChange={(event) => handleBatchChange(index, event)}
              />
              <input
                className="input"
                type="text"
                name="size"
                placeholder="Size"
                value={batch.size}
                onChange={(event) => handleBatchChange(index, event)}
              />
              <input
                className="input"
                type="text"
                name="courses"
                placeholder="Courses (comma separated)"
                value={batch.courses}
                onChange={(event) => handleBatchChange(index, event)}
              />
            </div>
          ))}
          <button className="button" onClick={addBatch}>
            Add Batch
          </button>
        </div>

        <button className="button-submit" onClick={submitDetails}>
          Submit Details
        </button>
      </div>
    );
  }

  const days = [
    "Time Slot",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const maxSlots = 8; // Assuming 8 time slots per day

  return (
    <div className="App">
      <h1>Generated Schedule</h1>
      <div className="fitness-score">
        <h2>Fitness Score: {schedule.fitness}</h2>
        <p>Higher score indicates better schedule quality</p>
      </div>
      {Object.keys(schedule.batches).map((batch) => (
        <div key={batch} className="batch-schedule">
          <h2>Batch: {batch}</h2>
          <table className="timetable">
            <thead>
              <tr>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: maxSlots }, (_, slotIndex) => (
                <tr key={slotIndex}>
                  <td>{`Slot ${slotIndex + 1}`}</td>
                  {[0, 1, 2, 3, 4].map((dayIndex) => (
                    <td key={dayIndex}>
                      {schedule.batches[batch].schedule[dayIndex][slotIndex] ? (
                        <div>
                          <div>
                            {
                              schedule.batches[batch].schedule[dayIndex][
                                slotIndex
                              ].course
                            }
                          </div>
                          <div className="hall-name">
                            {
                              schedule.batches[batch].schedule[dayIndex][
                                slotIndex
                              ].hall
                            }
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <button onClick={() => setSchedule(null)}>Generate New Schedule</button>
    </div>
  );
}

export default App;
