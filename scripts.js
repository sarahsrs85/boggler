//Sarah Simpson project 4 javascript

//have 4x4 grid (x)
//generate or have stored letters for different levels 
//on click of start button 
//populate letters to grid(x)
//user inputs words to text box and submits(x)
//either store words or display when matched to computer answer(x)
//game ends display results (x)
//https://www.jqueryscript.net/demo/Circular-Percentage-Loader-Plugin-with-jQuery-Canvas-ClassyLoader/
//* tally points based on boggle rules and or % of total possible answers(x)
//tweet results >>>need hosting working before drive traffice there
//*click on answers to get dictionary definition (x)
//*scoreboard
//rules(x)
//restart game (x)
//different tiles (x)


myBoggler = [];
//myBoggler.Board = [];
//myBoggler.url = `http://api.codebox.org.uk/boggle/${myBoggler.Board}`
myBoggler.userAnswers = [];
myBoggler.computerAnswers = [];//boggle api results
myBoggler.word = [];//word clicked on to send to get root
myBoggler.rootWord = [];//oxford results to get root word
myBoggler.defineWord = [];//
myBoggler.dictionary = [];//oxford api results (TBA)
myBoggler.correctAnswers =[];
myBoggler.uniq = []; //correct answers from user with no repeats

$(document).tooltip();

myBoggler.PossibleBoard = ['SEMFRATEELWSIDNO', 'LEMISATOELPSIDNO', 'RIDSHLAYOELBERUP']
function randomItem(finalArray) {
    const index = Math.floor(Math.random() * finalArray.length);
    return finalArray[index];
    console.log(randomItem)
}
myBoggler.Board = randomItem(myBoggler.PossibleBoard);
// for boggle possible answers
$.ajax({
    url: `http://api.codebox.org.uk/boggle/${myBoggler.Board}`,
    method: 'GET',
    dataType: 'json'
}).then(function (results) {
    myBoggler.computerAnswers = (results)
});


//this is where all the magic happens
myBoggler.events = (e) => {
    //to split up the letters to distribute
    const letters = myBoggler.Board.split("");
    letters.forEach((letter, index) =>{
    $('.grid').append(`<div class="box"><p class="letter${index}"> ${(letter)}</p></div>`) 
    })
    $('.restart').hide();
    $('.loader').hide();
    $('.missedAnswers').hide();
    $('.endGame').show();

    $('.start').on('click', (e) => {
        //get rules off screen
        e.preventDefault();
        $('.rules').hide();
    })
   
    
    
    $('form').on('submit', (e) =>{

        //prevent default and store user answers
        e.preventDefault();
        let userAnswers = $('.userAnswers').val().trim().toUpperCase();
        
        myBoggler.userAnswers.push(userAnswers);

        //clears input field 
         $('.userAnswers').val('');
        
         //compares answers and stores correct answer in new array
        myBoggler.correctAnswers = myBoggler.userAnswers.filter(function(wordMatch){
            return myBoggler.computerAnswers.includes(wordMatch) 
        }) 
        //displayings user answers on the page
        displayUserAnswers = myBoggler.correctAnswers.join(' ');
        $('.correctAnswers').html(`<h2>My Answers</h2><p>${([displayUserAnswers])}</p>`);  
        
    })//end of form submit 
    
    
    $('.endGame').on('click touch', (e) => {
        
        e.preventDefault();
       
        $('.playing').hide();
        $('.endGame').hide();
        $('.restart').show();
        $('.loader').show();
        $('.missedAnswers').show();
        //scroll so ou can see results
        $('html,body').animate({
        scrollTop: $(".loader").offset().top},
        'slow');
        //make sure no duplicate answers
        myBoggler.uniq = new Set(myBoggler.correctAnswers);
       
        //getting percentage scored
        let percentage = (myBoggler.uniq.size / myBoggler.computerAnswers.length) * 100;
        //show percentage results (plugin)
        let loader = $('.loader').ClassyLoader({
            percentage: 100,
            speed: 100,
            fontColor: 'rgba(25, 25, 25, 0.6)',
            lineColor: 'rgba(55, 55, 55, 1)',
            remainingLineColor: 'rgba(55, 55, 55, 0.4)',
            lineWidth: 10,
        });
        loader.draw(percentage);
        //sort to missed answers only
        let displayComputerAnswers = myBoggler.computerAnswers.filter(function (wordMatch) {
           if (myBoggler.userAnswers.includes(wordMatch) === true){
               return false
           } else {
               return true
           }
        })
        //put missed answers on page 
        displayComputerAnswers = displayComputerAnswers.forEach((word, index) => {
            $('.missedAnswers').append(`<span class="answer defineWord${index}"> ${word} </span>`)
            
            $(`.defineWord${index}`).on('click touch', (e) => {
              
                myBoggler.word = $(`.defineWord${index}`).text().toLowerCase();
               //oxford api request for root word
                $.ajax({
                    url: 'http://proxy.hackeryou.com',
                    dataType: 'json',
                    method: 'GET',
                    data: {
                        reqUrl: `https://od-api.oxforddictionaries.com/api/v1/inflections/en/${myBoggler.word}`, 
                        
                        proxyHeaders: {
                            app_key: '2f2b516ae8aa465b6ff53e79a856c966',
                            app_id: '690348bd',
                            Accept: 'application/json'
                        },
                        xmlToJSON: false
                    }
                 })
                 .then(function (results) {
                    
                    myBoggler.rootWord = (results);
                    
                    myBoggler.defineWord = myBoggler.rootWord.results[0].lexicalEntries[0].inflectionOf[0].text;
                    })
                    .then(function (secondresults) {
                    //oxford api second request for definition to different endpoint
                    $.ajax({
                        url: 'http://proxy.hackeryou.com',
                        dataType: 'json',
                        method: 'GET',
                        data: {
                            reqUrl: `https://od-api.oxforddictionaries.com/api/v1/entries/en/${myBoggler.defineWord}`,

                            proxyHeaders: {
                                app_key: '2f2b516ae8aa465b6ff53e79a856c966',
                                app_id: '690348bd',
                                Accept: 'application/json'
                                },
                            xmlToJSON: false
                            }
                        }).then(function (finalResults) {
                            myBoggler.finalWord = (finalResults);
                            myBoggler.dictionary = myBoggler.finalWord.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
                        }).then(function(display) {
                            $('.answer').attr("title", `${myBoggler.defineWord}:  ${myBoggler.dictionary}.`);
                           
 
                    })//2nd request for rootword definition 
                        
                 })//root word results
            })//selecting word to define
           
        })//display comp results

    })//end game results
    //reload the game
    $('.restart').on('click touch', (e) => {
    location.reload();
    })
};//end of events

myBoggler.init = () => {
        myBoggler.events();
        
};//end of init

//my doc ready 
$(myBoggler.init);






