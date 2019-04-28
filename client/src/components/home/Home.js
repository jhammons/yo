import React, { Component } from "react";
import "./Home.css";
import { createShortUrl } from "../../APIHelper";
import config from "../../config/config";
import Filter from 'bad-words';

var filter = new Filter();
filter.addWords('maga'); // Items listed here will be replaced with ****
filter.removeWords('hells', 'god'); // Items listed here will NOT be filtered

class Home extends Component {
  constructor() {
    super();
    this.state = {
      showShortenUrl: false,
      shortenUrl: "",
      originalUrl: "",
      baseUrl: "",
      apiUrl: config.apiUrl,
      clickSubmit: true,
      showError: false,
      apiError: "",
      showApiError: false,
      showLoading: false,
      exUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      exLinkName: "Rick",
      allYos: "",
      popYos: "",
      liveYos: ""
    };
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.extractHostname = this.extractHostname.bind(this);
    this.checkHostname = this.checkHostname.bind(this);
    this.getAllYos = this.getAllYos.bind(this);
    this.getPopularYos = this.getPopularYos.bind(this);
    this.getLiveYos = this.getLiveYos.bind(this);
  }

  handleUserInput(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  }

  extractHostname(url) {
    var hostname;
    // Find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf("//") > -1) {hostname = url.split('/')[2];}
    else {hostname = url.split('/')[0];}
    // Find & remove port number
    hostname = hostname.split(':')[0];
    // Find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
  }

  checkHostname(bUrl, oUrl) {
    var baseUrl = this.extractHostname(bUrl).replace(/\\(.)/mg, "$1");
    var originalUrl = this.extractHostname(oUrl).replace(/\\(.)/mg, "$1");
    if(baseUrl === originalUrl) { return true }else { return false }
  }

  handleSubmit() {
    this.setState({ clickSubmit: true, showApiError: false });
    if (this.state.clickSubmit && this.state.originalUrl) {
      this.setState({ showLoading: true, showShortenUrl: false });

      let reqObj = {
        originalUrl: this.state.originalUrl,
        linkName: this.state.linkName.toLowerCase(),
        shortBaseUrl: config.baseUrl
      };

      // Ensure that links are not pointing back to Yo, essentially creating a loop.
      if(this.checkHostname(config.baseUrl, reqObj.originalUrl)) {
        this.setState({
          showLoading: false,
          showApiError: true,
          apiError: "Redirects back to Yo are not permitted."
        })
        return;
      }

      // Ensure linkName's aren't too long
      if(this.state.linkName.length > 99) {
        this.setState({
          showLoading: false,
          showApiError: true,
          apiError: "Please pick a shorter name."
        })
        return;
      }

      // Profanity filter for linkName's
      if(filter.isProfane(reqObj.linkName)) {
        this.setState({
          showLoading: false,
          showApiError: true,
          apiError: "This link name is not supported.",
          originalUrl: "",
          linkName: ""
        })
        return;
      }

      createShortUrl(reqObj)
        .then(json => {
          setTimeout(() => {
            this.setState({
              showLoading: false,
              showShortenUrl: true,
              shortenUrl: json.data.shortUrl,
              originalUrl: "",
              linkName: ""
            });
          }, 0);
        })
        .catch(error => {
          this.setState({
            showLoading: false,
            showApiError: true,
            apiError: error.response.data
          });
        });
    } else {
      this.setState({ showError: true });
    }
  }

  renderButton() {
    if (!this.state.showLoading) {
      return (
        <button
          className="btn waves-effect waves-light submit-btn grey-text text-darken-4"
          name="action"
          onClick={this.handleSubmit}
        >
          Submit
        </button>
      );
    } else {
      return (
        <div className="loader">
          <div className="preloader-wrapper small active">
            <div className="spinner-layer spinner-green-only">
              <div className="circle-clipper left">
                <div className="circle" />
              </div>
              <div className="gap-patch">
                <div className="circle" />
              </div>
              <div className="circle-clipper right">
                <div className="circle" />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  getAllYos() {
    fetch(this.state.apiUrl + 'all')
    .then(res => res.json())
    .then(out => {
        this.setState({allYos: out})
      }
    )
    .catch(err => {
        console.log("All Yos Error: " + err);
      }
    )
  }

  getPopularYos() {
    fetch(this.state.apiUrl + 'popular')
    .then(res => res.json())
    .then(out => {
        this.setState({popYos: out})
      }
    )
    .catch(err => {
        console.log("Popular Yos Error: " + err);
      }
    )
  }

  getLiveYos() {
    fetch(this.state.apiUrl + 'recent')
    .then(res => res.json())
    .then(out => {
        this.setState({liveYos: out})
      }
    )
    .catch(err => {
        console.log("Live Yos Error: " + err);
      }
    )
  }

  componentDidMount(){
    this.getAllYos();
    this.getPopularYos();
    this.getLiveYos();
  }

  render() {
    return (
      <div>
        <ul id="tabs-swipe-demo" className="tabs grey darken-3">
          <li className="tab col s3"><a className="active teal-text" href="#test-swipe-1">Create</a></li>
          <li className="tab col s3"><a className="teal-text" href="#test-swipe-2">Popular</a></li>
          <li className="tab col s3"><a className="teal-text" href="#test-swipe-3">Live</a></li>
        </ul>
        <div id="test-swipe-1" className="col s12 teal-text">
          {/* TAB 1 */}
          <div>
            <h5 className="grey-text text-darken-2">Original URL</h5>
          </div>
          <input
            name="originalUrl"
            field="originalUrl"
            placeholder={this.state.exUrl}
            value={this.state.originalUrl}
            onChange={this.handleUserInput.bind(this)}
          />

          {this.state.showError && (
            <div className="formError">A URL is required</div>
          )}

          <br/><br/>
          
          <div>
            <h5 className="grey-text text-darken-2">Link Name</h5>
          </div>
          <input
            data-length="99"
            name="linkName"
            field="linkName"
            placeholder={this.state.exLinkName}
            value={this.state.linkName}
            onChange={this.handleUserInput.bind(this)}
          />

          {this.state.showError && (
            <div className="formError">A Link Name is required</div>
          )}

          <br/><br/>

          {this.renderButton()}

          {this.state.showApiError && (
            <div className="shorten-error">{this.state.apiError}</div>
          )}

          {this.state.showShortenUrl && (
            <div className="shorten-title grey-text text-darken-2">
              Shortened URL is  🡆  {` `}
              <a href={this.state.shortenUrl} target="_blank" rel="noopener noreferrer">
                {this.state.shortenUrl}
              </a>
            </div>
          )}
        </div>
        <div id="test-swipe-2" className="col s12 grey-text">
          {/* TAB 2 */}
          <table>
            <thead>
              <tr>
                  <th>Link Name</th>
                  <th>Site URL</th>
                  <th>URL Hits</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.popYos.length > 0 
              ? this.state.popYos.map(function(yo, key) {
                return (
                  <tr key={key}>
                    <td><pre>{yo.linkName}</pre></td>
                    <td><a key={key} className="grey-text text-darken-2" href={yo.originalUrl} target="_blank" rel="noopener noreferrer">{yo.originalUrl}</a></td>
                    <td>{yo.urlHits}</td>
                  </tr>
                )
              }, this)
              : null
            }
            </tbody>
          </table>
        </div>
        <div id="test-swipe-3" className="col s12 grey-text">
          {/* TAB 3 */}
          <table>
            <thead>
              <tr>
                  <th>Link Name</th>
                  <th>Site URL</th>
                  <th>Last Access</th>
              </tr>
            </thead>
            <tbody>
            {
              this.state.liveYos.length > 0 
              ? this.state.liveYos.map(function(yo, key) {
                return (
                  <tr key={key}>
                    <td><pre>{yo.linkName}</pre></td>
                    <td><a key={key} className="grey-text text-darken-2" href={yo.originalUrl} target="_blank" rel="noopener noreferrer">{yo.originalUrl}</a></td>
                    <td>{yo.lastAccess}</td>
                  </tr>
                )
              }, this)
              : null
            }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Home;
