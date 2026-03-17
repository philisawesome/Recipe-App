import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { aws_s3_deployment as s3deploy } from 'aws-cdk-lib';
import { aws_certificatemanager as acm } from 'aws-cdk-lib';
import { aws_cloudfront as cloudfront } from 'aws-cdk-lib';
import { aws_cloudfront_origins as origins } from 'aws-cdk-lib';

// https://paulallies.medium.com/deploy-a-static-website-on-aws-s3-with-custom-domain-using-aws-cdk-4db7f388dc46
//
export class DeployStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
	const DOMAIN_NAME = 'stovetop.cc';

    // Create an S3 bucket to host the static website
    const bucket = new s3.Bucket(this, 'StaticWebsiteBucket', {
      bucketName: DOMAIN_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      publicReadAccess: true,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      }),
      versioned: true,
      websiteIndexDocument: 'index',
    });

	// Deploy website files to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../dist')], // Path to the directory containing the index file
      destinationBucket: bucket,
    });

    // Create a reference to SSL certificate in ACM
    const certificateArn = 'arn:aws:acm:us-east-1:538712951650:certificate/597ec445-525c-4a76-a90c-02bbf569425a';
    const certificate = acm.Certificate.fromCertificateArn(this, 'StaticSiteCertificate', certificateArn);

    // Create a CloudFront distribution
    const cdn = new cloudfront.Distribution(this, 'StaticSiteCDN', {
      domainNames: [DOMAIN_NAME],
      defaultBehavior: {
        origin: new origins.HttpOrigin(bucket.bucketWebsiteDomainName, {
          protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          httpPort: 80,
          httpsPort: 443
        }),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true
      },
      certificate: certificate
    });

    // Output the CloudFront domain name
    new cdk.CfnOutput(this, 'StaticSiteCDNDomain', {
      value: cdn.domainName,
    });
  }
}
