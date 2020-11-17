import React, { useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import NewsCards from "./components/NewsCards/NewsCards";
import useStyles from "./styles";
import { Typography } from "@material-ui/core";
import wordsToNumbers from "words-to-numbers";

function App() {
  const [newsArticles, setNewsArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState();
  const classes = useStyles();
  useEffect(() => {
    alanBtn({
      key: process.env.REACT_APP_ALAN_KEY,
      onCommand: ({ command, articles, number }) => {
        if (command === "newHeadlines") {
          setNewsArticles(articles);
          setActiveArticle(-1);
        } else if (command === "highlight") {
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if (command === "open") {
          const parsedNumber =
            number.length > 2
              ? wordsToNumbers(number, { fuzzy: true })
              : number;
          const article = articles[parsedNumber - 1];

          if (parsedNumber > 20) {
            alanBtn().playText("Please try again");
          } else if (article) {
            window.open(article.url, "_blank");
            alanBtn().playText("Opening...");
          }
        }
      },
    });
    
    let response = await fetch("https://staging.viot.portal.graphicx.io/api/v1/oauth/token/",{
      method:"POST",
      body: JSON.stringify({username:"user",password:"123",grant_type:"password"}),
      headers:new Headers({
        "Access-Control-Allow-Origin":"https://fervent-ritchie-a3da89.netlify.app/",
        "Authorization":"Basic cF92b2RfcG9ydGFsX2NsaWVudDpkM2tYam9ZWE1FM0xJa3ZkdVNqVmJ3eEN6ckh4dV8=",
        "X-TenantID":"p_vod",
        "Content-type":"application/x-www-form-urlencoded"
      })
    })
  }, []);
  return (
    <div>
      <div className={classes.logoContainer}>
        {newsArticles.length ? (
          <div className={classes.infoContainer}>
            <div className={classes.card}>
              <Typography variant="h5" component="h2">
                Try saying: <br />
                <br />
                Open article number [4]
              </Typography>
            </div>
            <div className={classes.card}>
              <Typography variant="h5" component="h2">
                Try saying: <br />
                <br />
                Go back
              </Typography>
            </div>
          </div>
        ) : null}
        <img
          src="https://alan.app/voice/images/previews/preview.jpg"
          className={classes.alanLogo}
          alt="logo"
        />
      </div>
      <NewsCards articles={newsArticles} activeArticle={activeArticle} />
    </div>
  );
}
export default App;
