# Facebook Messenger Analyzer

## WARNING: Facebook have changed the structure of the downloaded data, and now instead of all the messages being in one file, they are separated into multiple with 10.000 messages each. The script needs changing before it can function again.

A simple tool which will help you make graphs out of your facebook messenger conversations. Calculates tons of stuff including: 
* Message count per person
* Words count per person
* How many times a person initiated the chat?
* Average response time per person
* Total messages
* Chat duration
* Average messages per day
* Longest streak of everyday messaging
* Date with most messages
* Most used words (table and graph)
* Most used emojis (table only)
* Messages per day (graph)
* Total messages over time (graph)
* Messages per time of the day (graph, 2 types)
* Every initiating message + filtering option
* Comparing multiple people's

## Getting started

Follow the steps in order to run the project.

### Installing

* Download [NodeJS](https://nodejs.org/en/download/) in order to run the analyzing tool. Follow the steps in the installer.
* Clone or download this repository. 
* Open a command window in the project's root directory (PowerShell for Windows users)
* Once opened install dependencies
```
npm install
```
* Once installed you are ready to go.

### Getting your information from Facebook

Navigate to [this facebook settings page](https://www.facebook.com/dyi/?x=Adn_DsUKMsh5USql&referrer=yfi_settings)

Set format to 'JSON' and Media Quality to 'Low'
![settings image](https://preview.ibb.co/mCjauJ/fb_sett.png)

**Make sure you have only checked Messages so the files size and prepartion time will be lower.**

Wait until Facebook is done collecting your data and has given you a download link *(this may take up to few hours).*

Once you're info is ready download it, extract it and open **/messages/** folder. There you will see every person you have ever messaged to.
Open the folder with the person you want to analyze your chat *(folders may have some funky names but understandable)*
Copy the **messages.json** file to the repository's folder. You may want to rename the file to something like **person.json** in case you want to add more files.

### Running

Open your shell again and type:

```
npm run analyze messages.json
```

In case you renamed your file replace **messages.json** with the new name.

Once the analyzing is finished you can navigate to the web page and see the results.


### Resetting

If you want to reset the data and start over
```
npm run reset
```

## Viewing the results

Open projects root directory.
Open **/web/** directory.
Open **index.html**.

Have fun!

### In case of errors and unexpected behaviour

Please be kind enough to report.

Feel free to try to fix it yourself and make a pull request.

## Built With

* [NodeJS](https://nodejs.org/en/) - Parsing the data
* [iconv-lite](https://www.npmjs.com/package/iconv-lite) - Fixing facebooks file encoding for cyrillic users
* [node-emoji](https://www.npmjs.com/package/node-emoji) - Collecting data about emojis
* [ChartJS](https://www.chartjs.org/) - Easily generating beautiful JS charts

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
