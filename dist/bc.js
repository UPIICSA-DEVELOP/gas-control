(function () {


  let userInfo = {};

  const webshot = require('webshot');

  process.on('message', (data) => {
    getUserInfo(data);
  });

  function getUserInfo(data) {
    userInfo = {
      imageUrl:  data.imageUrl || 'https://inspector-maplander-develop.appspot.com/favicon.png',
      company:  data.company || '',
      name:  data.name || '',
      workPosition: data.workPosition || '',
      phone:  data.phone || '',
      email:  data.email || '',
      website:  data.website || ''
    };

    let FINAL_HTML = getHtml(1);
    if(userInfo.website !== ''){
      FINAL_HTML += getHtml(2);
    }
    FINAL_HTML += getHtml(3);

    const renderStream = webshot(FINAL_HTML, {siteType:'html', shotSize: { width: 900, height: 500 }});
    let chunks = [];
    renderStream.on('data', function(chunk) {
      chunks.push(chunk);
    });
    renderStream.on('end', function() {
      const result = Buffer.concat(chunks);
      finish(result.toString('binary'));
    });
  }

  function finish(result) {
    process.send(result);
  }

  function getHtml(type) {
    switch (type){
      case 1:
        return `
      <!doctype html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport"
                content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Document</title>
        </head>
        <body style="padding: 0; margin: 0; font-family: 'Helvetice New', 'Arial', sans-serif;">
        <div style="position: relative;
        background: url('https://lh3.googleusercontent.com/pLsyMJEYQgJ11EvK4NKx75l17gKYx6PlD0ip1oRQTTKOISKM9YJ1Qcwz-Uoua4AV38qKqXbYWmRZbeKHEIMV-uuWFLFtR4Ue=s1600') no-repeat center;
        background-size: contain;
        width: 900px;
        padding-bottom: calc(900px / 9 * 5);
        box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);">
          <img style="position: absolute;
            top: 10.58%;
            left: 6.16%;
            width: 25.18%;
            height: 45.33%;" src="${userInfo.imageUrl}" class="image">
        
          <div style="position: absolute;
              top: 28.11%;
              left: 33.56%;
              width: 60%;
              height: 9%;
              font-size: 40px;
              font-weight: bold;">
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; display: block;">
              ${userInfo.company}
            </span>
          </div>
        
          <div style="position: absolute;
              top: 38.93%;
              left: 33.56%;
              width: 55%;
              height: 7.2%;
              color: #9d9d9d;
              font-size: 32px;">
            <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden; display: block;">
              ${userInfo.name}
            </span>
          </div>
        
          <div style=" position: absolute;
              top: 47.66%;
              left: 33.56%;
              width: 100%;
              height: 5.6%;
              color: #9d9d9d;
              font-size: 24px;">
            <span>${userInfo.workPosition}</span>
          </div>
        
          <div style="position: absolute; left: 6.16%; top: 62.9%; height: 5.6%; color: #9d9d9d;">
            <img src="https://lh3.googleusercontent.com/a8VUrQXZgKG-c06ZXK2yda0F1-Wo_ZULg7WnZ_6D18qz4G-MTUCUpbnJJlLwu3dV-cJCnPIAhWArqqqcleXxYI1JJrjSDdK2">
            <span style="position: absolute; top: 0; left: 38px; font-size: 28px;">${userInfo.phone}</span>
          </div>
        
          <div style="position: absolute; left: 6.16%; top: 72.38%; height: 5.6%; color: #9d9d9d;">
            <img src="https://lh3.googleusercontent.com/bXY4E01tx1n1mGcPKlYXx_tKbm9n4saJ9mM7UT69krIc9-KhdHXZnoZBFzZkxuNUaY25d5Y6jjD0_vzOJWllT8InTa1Q9GO9rq0">
            <span style="position: absolute; top: 0; left: 38px; font-size: 28px;">${userInfo.email}</span>
          </div>
 `;
      case 2:
        return `<div style="position: absolute; left: 6.16%; top: 81.83%; height: 5.6%; color: #9d9d9d;">
                  <img src="https://lh3.googleusercontent.com/3VAJ_o0YPucj7rOVcziJm4d0nqW0YKIf6y_OnxDbR1QoIXXPFe8a_mcKNEyrF-mX2BHaANd6EA0GJPcLTivknRA0_qXz6Y0fkQ">
                  <span style="position: absolute; top: 0; left: 38px; font-size: 28px;">${userInfo.website}</span>
                </div>`;
      case 3:
        return `</div></body></html>`;
    }
  }


})();
