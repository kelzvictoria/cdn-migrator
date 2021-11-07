const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./sampleClient.js"); // Helper function that creates Amazon S3 service client module.

const orphans = require("./generated-csv/s3_orphan_urls.json");

const orphan_urls = orphans.map((o) => o["Formelo CDN URL"]);
// .filter((o) => o.includes("cdn.formelo.com"));

console.log("orphan_urls", orphan_urls);

let s3Keys = [];
let bucket_name = "formelo-cdn-sample";

const getS3Keys = () => {
  for (let i = 0; i < orphan_urls.length; i++) {
    // if (orphan_urls[i].includes("cdn.formelo.com")) {
    s3Keys.push(orphan_urls[i].split("cdn.formelo.com")[1].substring(1));
    // }
  }
};

const run = async (s3Key) => {
  try {
    const data = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket_name,
        Key: s3Key,
      })
    );
    console.log(`${s3Key} has been deleted successfully.`);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

const deletedS3OrphanUrls = () => {
  getS3Keys();
  //console.log("s3Keys", s3Keys);

  for (let i = 0; i < s3Keys.length; i++) {
    //  console.log(i, "s3Key: ", s3Keys[i]);
    run(s3Keys[i]);
  }
};

deletedS3OrphanUrls();
