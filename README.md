Buy and sell Project is a simple online store for buyers and sellers to carry out transactions offline.
<br/><b>Requirements:</b> 
<br/>Nodejs version 15
<br/>Mongodb database
<br/><br/>
<b>Admin:</b><br/>
To create an Admin account, create an account as a normal user and change the role to <b>Admin</b> from the database<br/>

<b>*.ENV for backend*</b><br/>
PORT=3000<br/>
CONNECTION_STRING=your_mongodb_connection_string<br/>
HASH_KEY=KEY<br/>
GMAIL=your_email_address@gmail.com<br/>
GMAIL_APP_PASSWORD=GMAIL_APP_PASSWORD<br/>
GOOGLE_CLIENT_ID=YOUR_ID<br/>
GOOGLE_CLIENT_SECRET=YOUR_KEY<br/>
REDIRECT_URL=https://website.com/<br/>
FLW_PUBLIC_KEY=FLWPUBK_TEST-FLUTTERWAVE_K-X<br/>
FLW_SECRET_KEY=FLWSECK_TEST-FLUTTERWAVE_K-X<br/>
FLW_ENCRYPTION_KEY=FLUTTERWAVE_K<br/>
GOOGLE_MAPS_API_KEY=<br/>
NODE_ENV=dev<br/>
FILE_UPLOAD_ROOT_DEV=\local_file_upload_root<br/>
FILE_UPLOAD_ROOT_PROD=/production_file_upload_root",
<br/><br/>

<b>*.ENV for frontend*</b><br/>
API_URL=http://192.168.43.22:3000/api/<br/>
API_URL_LIVE=https://website_url.com/api/<br/>
NEXTAUTH_URL=https://website_url.com<br/>
NEXT_PUBLIC_SITE_URL=https://website_url.com<br/>
NODE_ENV=dev<br/><br/>



