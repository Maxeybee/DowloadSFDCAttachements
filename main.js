const attachements = "./output-cli/extractCCPMAttachments.csv";
const noImage = "./txt/noImage.txt";
const ccpmRecords = "./output-cli/extractCCPM.csv";
const csvjson = require("csvjson");
const fs = require("fs");

const options = {
  delimiter: ",", // optional
  quote: '"', // optional
};

// retrieve data from dataloader CLI (example => 10:53 to 11:11 -> for 500 attachments 24 minutes )
// clean the csv file after data export... remove all the " coming from dataloader

function readFiles() {
  let dataNoImage = fs.readFileSync(noImage, "utf-8").toString();
  let attachmentsFile = fs
    .readFileSync(attachements, "utf-8")
    .toString()
    .replace(/"/g, "");
  //let ccpm = fs.readFileSync(ccpmRecords, "utf-8").toString().replace(/"/g, "");

  csvjson.toObject(attachmentsFile); // JSON
  //csvjson.toObject(ccpm); // JSON

  //let ccpmToArray = csvjson.toSchemaObject(ccpm, options); // JSON Object
  let attachmentsArray = csvjson.toSchemaObject(attachmentsFile, options); // JSON Object

  getData(attachmentsArray, dataNoImage, /*ccpmToArray*/);
}

function getData(attachmentsArray, dataNoImage, ccpmArray) {

  for (let i = 0; i < attachmentsArray.length; i++) {
    if (attachmentsArray[i].BODY != "") {
      const str = attachmentsArray[i].CONTENTTYPE;
      const substr = str.substring(str.indexOf("/") + 1);
      decodeBase64Data(attachmentsArray[i].BODY, substr, attachmentsArray[i].ID);
    }
    
  }
}

function decodeBase64Data(array_body, fileExt, id) {
  if (fileExt == "") {
    try {
      let buff = Buffer.from(array_body, "base64");
      let imageName = "./images/ccpm_image_"+id+".jpeg"; // adapt to each file format
      fs.writeFile(imageName, buff, (err) => {
        if (err) throw err;
        console.log("The binary data has been decoded and saved to" + imageName);
      });
    } catch (error) {
      console.log(error);
    }
  } else{
    try {
      let buff = Buffer.from(array_body, "base64");
      let imageName = "./images/ccpm_image_"+id+"."+fileExt;
      fs.writeFile(imageName, buff, (err) => {
        if (err) throw err;
        console.log("The binary data has been decoded and saved to" + imageName);
      });
      // write import file 
    } catch (error) {
      console.log(error);
    }
  }
}

function main() {
  readFiles();
}

main();

// Trigger the resize scripts

// convert back the images to base64 string
// Upload back the images using dataloader CLI