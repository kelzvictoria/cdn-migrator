<div id="top"></div>

[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">CDN Migration Tool</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <!-- <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li> -->
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <!-- <li><a href="#acknowledgments">Acknowledgments</a></li> -->
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

This is a web application that accepts a CVS file, converts it to a JSON file that contains an array of objects with the following keys:
`{ "Formelo Entity ID": "", "Formelo Attribute Key": "", "Formelo CDN URL": "", "PFABO CDN URL": "", "Size": 0, "Raw Data ID": "", "MSSQL Table": "", "MSSQL Column": 0, "MSSQL Record Code": 0, "Formelo DB ID": 0 }`

For each of the object in this array, a PATCH request is made to the Formelo API to replace the `Formelo CDN URL` value of that object with the `PFABO CDN URL` of same object.

Successful patches are added to written into a file called `s3_orphans.json`.

The s3_orphans.json file is used by the `deleteS3OrphanUrls` function which uses aws-sdk to delete the `Formelo CDN URL` files.

<!--
<p align="right">(<a href="#top">back to top</a>)</p> -->

### Built With

- [EJS](https://ejs.co/)
- [Express.js](https://expressjs.com/)
- [S3](https://aws.amazon.com/s3)

<!-- <p align="right">(<a href="#top">back to top</a>)</p> -->

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/kelzvictoria/cdn-migrator.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Create an env file in the root directory of your project `.env`
   ```env
   REALM_URL=
   CLIENT_ID=
   APP_PATH=
   ```
4. Fill in the missing env values with the appropriate credentials. Ask your team-lead for help in getting these values from the server.

   It is important to obtain these values before running the app if not certain requests cannot be granted through the app.

<p align="right">(<a href="#top">back to top</a>)</p>

## Roadmap

- [x] Make PATCH requests to replace Formelo CDN URLs with PFABO CDN URLs
- [x] Generate an Orphaned URLs CSV file
- [x] Use Orphaned URLs CSV file to determine files to delete from s3 bucket
  - [x] Make Delete requests to delete files from s3 bucket

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Victoria Kazeem - [@vickycinky](https://twitter.com/vickycinky) - vickycinky@ymail.com

Project Link: [https://github.com/kelzvictoria/cdn-migrator](https://github.com/kelzvictoria/cdn-migrator)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

- [Choose an Open Source License](https://choosealicense.com)
- [Img Shields](https://shields.io)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->

[license-shield]: https://img.shields.io/github/license/kelzvictoria/cdn-migrator.svg?style=for-the-badge
[license-url]: https://github.com/kelzvictoria/cdn-migrator/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/victoria-kazeem-062708bb/

<!-- [product-screenshot]: images/screenshot.png -->
