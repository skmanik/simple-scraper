// parses HTML so we can select elements to scrape
const cheerio = require("cheerio");
// makes HTTP request for HTML page
const request = require("request");

// url we are scraping
const url = "https://www.sourcewell-mn.gov/cooperative-purchasing/022217-wex";

request(url, function(error, response, html) {
  // note: '$' is a shorthand for cheerio's selector commands, much like jQuery's '$'
  const $ = cheerio.load(html);

  // get name and title of vendor from header
  const vendorName = $(".vendor-contract-header__content .h2").text();
  const vendorTitle = $(".vendor-contract-header__content p.lead").text();

  // split contract number and expiration text
  const vendorInfo = $(".vendor-contract-header__content p:not(.lead)").text().split("\n");
  const vendorContract = vendorInfo[0];

  // split expiration to get date only
  const vendorExpiryFull = vendorInfo[1].split(": ");
  const vendorExpiryDate = vendorExpiryFull[1];

  // get relevant file. this assumes contract forms are always listed second in files list
  const vendorContractFile = $(".field--name-field-contract-documents > div > div:nth-child(2) > span > span.file-link").children().attr("href");

  // contact info. this assumes we want contact info of first person listed
  const contactName = 
  	$("#tab-contact-information > article:first-of-type > div > div:nth-child(1)").text();
  const contactPhone =
  	$("#tab-contact-information > article:first-of-type > div > div:nth-child(2) > div.field--item").text();
  const contactEmail = 
  	$("#tab-contact-information > article:first-of-type > div > div:nth-child(3) > div.field--item").text();

  // compile JSON object
  const results = {
  	"title": vendorTitle,
  	"expiration": vendorExpiryDate,
  	"contract_number": vendorContract,
  	"files": [
  		{
  			"contract-forms": vendorContractFile
  		}
  	],
  	"vendor": {
  		"name": vendorName,
  		"contacts": [
  			{
  				"name": contactName,
  				"phone": contactPhone,
  				"email": contactEmail
  			}
  		]
  	}
  }

  // logged results
  console.log(results);
});