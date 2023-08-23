const fs = require("fs");

    const newAddress = process.argv[2];

    fs.writeFile("../my-app/src/.env", (`CONTRACT_ADDRESS = "${newAddress}"`), (error) => {
        if (error) {
            console.log(error);
          } else {
            console.log('File created successfully');
          }
    })



console.log(process.argv[2]);