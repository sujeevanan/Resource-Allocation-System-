const express = require('express');
const router = express.Router();
const { GeneticAlgorithm, formatTimetable } = require('../scheduler');

let batches = [];
let halls = [];
let lecturers = [];

router.post('/lecturers', (req, res) => {
  lecturers = req.body.lecturers;
//   console.log(lecturers);
  res.status(200).send('Lecturers information updated.');
});

router.post('/halls', (req, res) => {
  halls = req.body.halls;
//   console.log(halls);
  res.status(200).send('Halls information updated.');
});

router.post('/batches', (req, res) => {
  batches = req.body.batches;
//   console.log(batches);
  res.status(200).send('Batches information updated.');
});

router.post('/generate', async (req, res) => {
    try {
        // Validate that we have all required data
        if (!batches.length || !halls.length || !lecturers.length) {
            return res.status(400).json({
                success: false,
                error: 'Missing required data. Please submit all information first.'
            });
        }

        const ga = new GeneticAlgorithm(
            batches,
            halls,
            lecturers,
            100, // populationSize
            0.01, // mutationRate
            1000  // generations
        );

        const timetable = ga.run();
        const fitnessScore = ga.fitnessFunction(timetable);
        const formattedTimetable = formatTimetable(timetable, fitnessScore);

        res.json({
            success: true,
            data: formattedTimetable
        });

    } catch (error) {
        console.error('Error generating timetable:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error generating timetable'
        });
    }
});

module.exports = router;
