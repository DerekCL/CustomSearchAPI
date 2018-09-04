const rp = require("request-promise");
const util = require("util");

const cx = process.env.CX;
const apiKey = process.env.API_KEY;

function indexRoute(req, res, next) {
  const { companies } = req.query;
  const { google_id } = req.body;
  if (!Array.isArray(companies) || !companies.length) {
    return next(
      new Error("companies does not exist, is not an array, or is empty")
    );
  } else if (companies.length > 25) {
    return next(new Error("Too many companies please choose less than 25"));
  } else if (google_id === undefined || google_id === null) {
    return next(new Error("No google id Provided"));
  } else {
    const userVerificationOptions = {
      method: "POST",
      uri: `http://localhost:9000/verify/user`,
      json: true, // Automatically parses the JSON string in the response
      body: {
        google_id,
      },
    };
    return rp(userVerificationOptions)
      .then(authResponse => userVerification(authResponse))
      .then(isUser => companyDomainSearch(isUser, companies, next))
      .then(searchResponse => responseBuilder(searchResponse, res))
      .catch(err => {
        return next(new Error(err));
      });
  }
}

function userVerification(authResponse) {
  if (authResponse.status === "failure") {
    return false;
  }
  return true;
}

function companyDomainSearch(isUser, companies, next) {
  if (!isUser) {
    return next(new Error("Not An Authorized User"));
  }
  const searchArray = Promise.all(
    companies.map(company => {
      const rpOptions = {
        uri: `https://www.googleapis.com/customsearch/v1/?q=${company}&key=${apiKey}&cx=${cx}`,
        json: true, // Automatically parses the JSON string in the response
      };
      return rp(rpOptions);
    })
  );
  return searchArray;
}

function responseBuilder(searchResponse, res) {
  const companiesDomainResponse = searchResponse.map(companyResponse => {
    const { searchTerms } = companyResponse.queries.request[0];
    const { items } = companyResponse;
    const companyDomainObject = {
      name: searchTerms,
      domain: items[0].link,
    };
    return companyDomainObject;
  });
  return res.status(200).send(companiesDomainResponse);
}

module.exports = indexRoute;
