
# Resource Allocation System Using Genetic Algorithm

## Overview

The **Resource Allocation System** is a web-based application designed to automate the process of timetable scheduling and resource allocation for the Department of Computer Science at Trincomalee Campus, Eastern University. The system employs a **Genetic Algorithm** to optimize schedules, ensuring that all hard constraints are satisfied while minimizing conflicts and inefficiencies.

## Features

- **Automated Scheduling:** Generates optimal timetables for resource allocation across multiple batches.
- **Hard Constraint Satisfaction:** Ensures all requirements, such as time slots, venue capacity, and non-overlapping sessions, are met.
- **User-Friendly Interface:** Allows authorized personnel to log in and manage timetables effortlessly.
- **Conflict Resolution:** Reduces the likelihood of clashes between sessions, courses, or resources.
- **Batch-wise Allocation:** Supports resource allocation for multiple batches, streamlining the scheduling process.

## Technologies Used

### Frontend:
- **React** for building the user interface.
- **Bootstrap/Tailwind CSS** for responsive and aesthetic designs.

### Backend:
- **Node.js** and **Express.js** for server-side operations.
- **Genetic Algorithm** for solving scheduling problems.

### Database:
- **MongoDB/MySQL** for managing data related to courses, lecturers, venues, and time slots.

### Additional Tools:
- **Firebase** for authentication (optional).
- **Toastify** for notifications and alerts.

## Hard Constraints Implemented

1. Each course will have one timetable slot per day.
2. Each lecturer will have one teaching session at particular times.
3. Each venue will be occupied by only one session at any given time.
4. Each student can attend only one session at a time.
5. Course majors and core courses must not overlap.
6. Certain time slots may be restricted based on predefined constraints.
7. Venues must have sufficient capacity for assigned sessions.

## Genetic Algorithm Workflow

The system uses the following steps in the Genetic Algorithm to optimize resource allocation:

1. **Initialization:** Generate an initial population of random schedules.
2. **Fitness Evaluation:** Measure how well each schedule satisfies the constraints.
3. **Selection:** Choose the fittest schedules for reproduction.
4. **Crossover:** Combine parts of two parent schedules to produce new offspring.
5. **Mutation:** Introduce small changes in offspring schedules to maintain diversity.
6. **Replacement:** Replace the least fit schedules with the new offspring.
7. **Termination:** Repeat the process until an optimized solution is found or a maximum number of generations is reached.

## Usage

1. **Login:** Authorized users log in to the system.
2. **Input Data:** Provide details about courses, lecturers, students, venues, and time constraints.
3. **Generate Timetable:** Click the "Generate" button to create a timetable using the Genetic Algorithm.
4. **View and Edit:** Review the generated timetable and make manual adjustments if necessary.
5. **Export:** Save or print the final timetable for reference.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/username/resource-allocation-system.git
   ```
2. Install dependencies:
   ```bash
   cd resource-allocation-system
   npm install
   ```
3. Configure the database and server settings in the `.env` file.
4. Start the development server:
   ```bash
   npm start
   ```

## Benefits

- **Efficiency:** Saves time and effort compared to manual scheduling.
- **Scalability:** Capable of handling large datasets for multiple batches and courses.
- **Accuracy:** Ensures all constraints are met, reducing errors in resource allocation.

## Future Enhancements

- Integration with third-party calendar tools (e.g., Google Calendar).
- Enhanced conflict visualization and reporting.
- Support for dynamic constraints based on user input.

## License

This project is licensed under the MIT License.

