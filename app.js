const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const { log } = require("console");

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req,res){
    res.sendFile(__dirname+ "/signup.html");
});

app.post("/", function(req,res){
    var firstName=req.body.firstname;
    var lastName=req.body.lastname;
    var email=req.body.email;

    var data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    var jsonData=JSON.stringify(data);

    const url="https://us11.api.mailchimp.com/3.0/lists/43fad840ab";
    const options={
        method:"post",
        auth: "divy:74670d8b1992ee4dacd0cd1eb2b3c27a-us11"
    }

    const request=https.request(url, options, function(response){
        var code=response.statusCode;
        var errorCode=response.error_count;
        console.log(code);
        if (code==200 ) {
            res.sendFile(__dirname+ "/success.html");
        } 
        else {
            res.sendFile(__dirname+ "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});

// api key
// 74670d8b1992ee4dacd0cd1eb2b3c27a-us11

// list id
// 43fad840ab