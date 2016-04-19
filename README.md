# AIchat

Aichat is a chatbot writen in javascript that uses a modified [Naive Bayes](https://web.stanford.edu/class/cs124/lec/naivebayes.pdf "Naive Bayes") method for text  classification, allowing to identify the most likely class of a message in a csv document and returning an associated response. 

It includes additional parameters such as a coefficient that tolerates typing errors and associates [word stems](https://en.wikipedia.org/wiki/Word_stem "word stems"), and the optional function to add weights to different words on a string (language modeling).  

You can also omit certain words from the classification (low discriminating power) and to take context into account. The context is defined as the accumulated probability from the current and previous message.

AIchat uses a csv file containing the text strings to be classified against and the response to them, if activated it also can model language through the use of weights on the words on the text string. The files faqen.csv and faqes.csv provide example datasets for the chatbot.

A decision on the success of the classification can be set through the use of a jacobian estimator that calculates the success through word matches and  sentences length.

A maximum length for the messages can also be set, allowing the bot to divide long strings for multiple classifications, and responses.

You can test a running version for english (simple conversation) and spanish (flower shop support). You can also upload your own csv and test the classification of certain sentences.

[English Demo](http://www.onl.cl/AIchat/AIchatEN.html "english AIchat")

[Spanish Demo](http://www.onl.cl/AIchat/AIchatES.html "spanish AIchat")

[Upload csv Demo](http://www.onl.cl/AIchat/loadfile.html "upload AIchat")

The success of the chatbot and the classification is highly dependent on the design of the csv with the questions/mesages and the related responses. Check the example faqs faqen.csv and faqes.csv as points of reference on how to create a good data source for the chatbot.

AIchat is particularly useful in cases of situational conversations, such as giving information on products and how to buy them and deliver them, but it can also be used as a general purpose chatbot.

You can load the chatbot after referring all the dependencies (check AichatEN.html and AichatES.html), setting the layout and loading the following function:
```
init(csv,decider,reg,lengthmax,memory,coef,weights)
```

```
var reg = / it | the | a | or |and | and |\, |\. | to  /g; // list of words to omit, if you use weights do not set a score for that word
     var csv = "faqen.csv";   // file with questions and answers
     var decider=0.49; //  decides if the classification was successful or not (Jacobian)
     var lengthmax=6; // max sentence length before being divided by two sentences
     var memory=1; // 1 takes the last message sent into account for classification. 0 does not.
     var coef=0.7; // coefficient that allows typing errors and associates words with similar stems
     var weights=1; // 1 assigns weights to words from the csv field, 0 ignores weights.
```
The decider variable can be a number from 0 to 1. Likewise for the coef variable that assigns the value of the association of words through the use of the levenshtein distance [levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance "levenshtein distance"). 

You can customize the variable number values to tune the classification and the responses of your bot.

