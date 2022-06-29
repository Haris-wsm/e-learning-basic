const ErrorHanlder = require('../errors/ErrorHanlder');
const path = require('path');
const fs = require('fs');

const router = require('express').Router();

router.get('/file/download/:filename', async (req, res, next) => {
  try {
    const { filename } = req.params;

    let [_, ...originalFileName] = filename.split('-');
    originalFileName = originalFileName.join('-');
    const pathToFile = path.resolve('.', 'assignments', filename);
    const stat = await fs.promises.stat(pathToFile);
    res.download(pathToFile, (err) => {
      if (err) {
        console.log('somthimg went wrong with download file');
      }
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHanlder('Something went wrong', 500));
  }
});

module.exports = router;
