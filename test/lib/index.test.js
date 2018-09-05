const chai = require("chai");
const chaiHttp = require("chai-http");
const sinonChai = require("sinon-chai");
const { mockRes } = require("sinon-express-mock");
const assert = chai.assert;

const {
  userVerification,
  companyDomainSearch,
  responseBuilder,
} = require("../../lib/index");

const {
  searchResponseData,
  companiesData,
  authResponseData,
  endpoint,
  url,
  body,
} = require("./index.data");

const app = require("../../index");

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiHttp);

describe("POST Tests", () => {
  describe(`POST ${endpoint}`, () => {
    it("works without errors", () => {
      chai
        .request(app)
        .post(`${url}`)
        .send(body)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
        });
    });
  });
  describe(`userVerification`, () => {
    it("is false when the status fails", () => {
      const authResponse = {
        status: "failure",
      };
      const result = userVerification(authResponse);
      expect(result).to.be.false;
    });
    it("is true when the status succeeds", () => {
      const result = userVerification(authResponseData);
      expect(result).to.be.true;
    });
  });
  describe(`companyDomainSearch`, () => {
    it("works as expected", () => {
      const isUser = true;
      const next = "";
      assert(
        companyDomainSearch(isUser, companiesData, next),
        searchResponseData
      );
    });
  });
  describe(`responseBuilder`, () => {
    it("works as expected", () => {
      const res = mockRes();
      responseBuilder(searchResponseData, res);
      expect(res.status).to.be.calledWith(200);
    });
  });
});
