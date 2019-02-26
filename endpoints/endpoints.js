
'use-strict';

const path = require('path');
const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();

router.all('*', function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
  res.setHeader("Content-Type", "application/json");
  next();
});

router.get('/bc', [ check(['company', 'name', 'lastName', 'workPosition', 'phone', 'email', 'countryCode', 'industryCode']).exists() ],function (req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).end(JSON.stringify(
        {
          code: 422,
          description: 'Incomplete params, consult https://inspector-maplander-develop.appspot.com/endpoints/v1/api-docs/#/Business%20Card/get_bc',
          ubcLite: null
        }
      ))
    }else{
      const { company, name, lastName, workPosition, phone, email, website, countryCode, industryCode, profileImage, profileImageThumbnail } = req.query;
      const { fork } = require('child_process');
      const process = fork(path.resolve(__dirname, 'endpoints', 'bc.js'));
      process.on('message', (data) => {
        res.status(data.code).end(JSON.stringify(data));
      });
      process.send({
        name: name,
        lastName: lastName,
        company: company,
        workPosition: workPosition,
        phone: phone,
        email: email,
        countryCode: countryCode,
        industryCode: industryCode,
        website: website || null,
        profileImage: profileImage || null,
        profileImageThumbnail: profileImageThumbnail || null
      });
    }
  }catch (e){
    console.error(e);
    res.status(500).end(JSON.stringify(
      {
        code: 500,
        description: 'Internal server error',
        ubcLite: null
      }
    ))
  }
});

router.get('/pdf', [ check(['attachedType']).exists() ], function(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).end(JSON.stringify(
        {
          code: 422,
          description: 'Incomplete params, consult https//inspector-maplander-develop.appspot.com/endpoints/v1/api-docs'
        }));
    }else{
      const data = {
        attachedType:  req.query.attachedType
      };
      const { fork } = require('child_process');
      const process = fork(path.resolve(__dirname, 'endpoints', 'pdf.js'));
      process.on('message', (data) => {
        if(data.code === 200){
          res.writeHead(data.code, {
            'Content-Type': 'application/pdf',
            'Content-disposition': 'attachment;filename=attached.pdf',
          });
          res.end(data.file, 'binary');
        }else{
          res.status(data.code).end(JSON.stringify(data));
        }
      });
      process.send(data);
    }
  }catch (e){
    console.error(e);
    res.status(500).end(JSON.stringify(
      {
        code: 500,
        description: 'Internal server error'
      }
    ));
  }
});

module.exports = router;
