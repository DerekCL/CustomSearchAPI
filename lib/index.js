const rp = require("request-promise");

function indexRoute(req, res, next) {
  const cx = process.env.CX;
  const apiKey = process.env.API_KEY;
  const { companies } = req.query;
  if (!Array.isArray(companies) || !companies.length) {
    return next(
      new Error("companies does not exist, is not an array, or is empty")
    );
  } else if (companies.length > 25) {
    return next(new Error("Too many companies please choose less than 25"));
  } else {
    const companyDomainSearch = Promise.all(
      companies.map(company => {
        const rpOptions = {
          uri: `https://www.googleapis.com/customsearch/v1/?q=${company}&key=${apiKey}&cx=${cx}`,
          json: true, // Automatically parses the JSON string in the response
        };
        return rp(rpOptions);
      })
    );
    companyDomainSearch
      .then(searchResponse => {
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
      })
      .catch(err => {
        // Crawling failed...
        return next(new Error(err));
      });
  }
}

module.exports = indexRoute;
