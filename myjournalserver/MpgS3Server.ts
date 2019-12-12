////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg S3 Server module
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { S3 } from "../myjournalapp/node_modules/aws-sdk";
const S3Api = new S3();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// create bucket
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function createBucket() {
  try {
    var params = {
      Bucket: "TestUser" + "Mpg030Data",
      CreateBucketConfiguration: {
        LocationConstraint: "ap-southeast-2"
      }
    };
    const response = await S3Api.createBucket(params);
    console.log("MpgS3: createBucket: success. Response: ", response);
  } catch (error) {
    console.log("MpgS3: createBucket: error. Error: ", error);
    throw error;
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// read a file from a bucket
// var params = {Bucket: BUCKET_NAME, Key: KEY_NAME};
//     new AWS.S3().getObject(params, function(err, json_data)
//     {
//       if (!err) {
//         var json = JSON.parse(new Buffer(json_data.Body).toString("utf8"));

//        // PROCESS JSON DATA
//            ......
//      }
//    });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// async function readFile() {
//   try {
//     var params = {
//       Bucket: "ahmedfattahsydneytest01",
//       key: "file01"
//       }
//     }
//     const response = await S3Api.createBucket(params);
//     console.log("MpgS3: createBucket: success. Response: ", response);
//   } catch (error) {
//     console.log("MpgS3: createBucket: error. Error: ", error);
//     throw error;
//   }
// }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// lambda entry point
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export const handler = async (requestData: any) => {
  try {
    console.log("MpgS3Server: request:", requestData);
    // let request = requestData as MpgData.MpgDataRequest
    return await createBucket();
  } catch (error) {
    return error;
  }
};
