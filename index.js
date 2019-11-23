const fs = require('fs');
const http = require('http');
const url = require('url');

// get port number or set to default
const port = process.env.PORT || 3000

// hardcoded data
const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);

// create server
const server = http.createServer((req, res) => {
  res.statusCode = 200;

  let urlParse = url.parse(req.url, true);
  const pathName = urlParse.pathname;
  const query = urlParse.query;
  const id = query.id;

  // Products Overview
  if(pathName === '/products' || pathName === '/'){
    fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err, data) => {
      let overViewOutput = data;

      fs.readFile(`${__dirname}/templates/template-card.html`, 'utf-8', (err, data) => {
        
        const cardsOutput = laptopData.map( el => replaceTemplate(data, el)).join('');
        overViewOutput = overViewOutput.replace('{%CARDS%}', cardsOutput);
        res.end(overViewOutput);
      });
    });
  } 

  // Laptop Detail
  else if (pathName === '/laptop' && id < laptopData.length){
    fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err, data) => {
      const laptop = laptopData[id];
      const output = replaceTemplate(data, laptop);
      res.end(output);
    });
  }

  // Images
  else if ((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
    fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
      res.writeHead(200, {'Content-type': 'image/jpg'});
      res.end(data);
    });
  }

  // Server Error
  else {
    res.writeHead(404, {'Content-type': 'text/html'});
    res.end('URL was not found on the server');
  }
});

// set server port
server.listen(port, () => {
  console.log(`Server running at port ${port}`);
})

function replaceTemplate (originalHtml, laptop){
  let output = originalHtml.replace(/{%PRODUCTNAME%}/g, laptop.productName);
  output = output.replace(/{%ID%}/g, laptop.id);
  output = output.replace(/{%IMAGE%}/g, laptop.image);
  output = output.replace(/{%PRICE%}/g, laptop.price);
  output = output.replace(/{%SCREEN%}/g, laptop.screen);
  output = output.replace(/{%CPU%}/g, laptop.cpu);
  output = output.replace(/{%STORAGE%}/g, laptop.storage);
  output = output.replace(/{%RAM%}/g, laptop.ram);
  output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
  return output;
}