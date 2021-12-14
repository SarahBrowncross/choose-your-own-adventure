const gameState = {
  score: 0,
};

const textDiv = document.getElementById('text-div');
const buttonDiv = document.getElementById('button-div');
const scoreDiv = document.getElementById('score-div');
const highscores = document.getElementById('highscores');

document.getElementById('submit').addEventListener('click', (event) => {
  event.preventDefault();
  const name = document.getElementById('input-box').value;
  if (name !== '') {
    fetch('https://untitled-northcoders-game.herokuapp.com/highscores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        score: gameState.score,
      }),
    })
      .then((res) => res.json())
      .then((scores) => {
        highscores.innerHTML = '';
        scores.forEach((score) => {
          const scoreDiv = document.createElement('div');
          scoreDiv.textContent = `Name: ${score.name}. Score: ${score.score}`;
          highscores.appendChild(scoreDiv);
        });
      });
  }
});

const setScreen = (text, options, callback) => {
  textDiv.textContent = text;
  buttonDiv.innerHTML = '';
  options.forEach((option, i) => {
    const button = document.createElement('button');
    button.textContent = option;
    button.addEventListener('click', () => callback(i));
    buttonDiv.appendChild(button);
  });
};

const handleScenario = (scenarioID) => {
  if (scenarioID === null) {
    handleEnding(gameState.score);
    return;
  }
  const scenario = scenarios[scenarioID];

  setScreen(
    scenario.text,
    scenario.options.map((option) => option.text),
    (i) => handleOption(scenario.options[i]),
  );
};

const handleOption = (option) => {
  gameState.score += option.scoreChange;
  displayScore(gameState.score);
  if (option.outcome === '') {
    return handleScenario(option.next);
  }
  setScreen(option.outcome, ['continue'], () => handleScenario(option.next));
};

const restart = () => {
  gameState.score = 0;
  displayScore(0);
  highscores.innerHTML = '';
  document.getElementById('input').style.display = 'none';
  handleScenario('wake_up');
};

const handleEnding = (score) => {
  let ending = '';
  if (score <= 20) {
    ending =
      'For you, coding is more than a problem, it’s a way to build relationships and learn about people as much as the code. \nYou want a team built on trust. \nThis way, when a challenge arises, you know whom best to turn to for help. You deeply understand that working in a team, you can solve any challenge. \nIn a team, you bring people together, keep morale high and understand which problem each person can work on best for the team to make solid progress. \nYou can enhance your skills by: \nUsing documentation more frequently, helping you to understand the code, \nUse Test Driven Development to keep you on track with your solutions. \nSnag your free preparation resources. Tips, tricks and content to ace your entry challenge...';
  } else if (score <= 40) {
    ending =
      'Coding for you is a well-oiled machine, you write your tests, you build your code, you add in any missing semicolons. Everything has its place and you will ensure that whatever you write is 100% air tight, production ready code.\nIn a team, you are vital for debugging the issues that inevitably occur that no one else can solve, \nkeeping the test suite well organised and functioning, \nand adding reliable code to the project.\nTo develop your process:\nEngage in Pair Programming, learning from others and their creative ways of solving problems,\nUse documentation to further enhance your code. \nSnag your free preparation resources. Tips, tricks and content to ace your entry challenge...';
  } else if (score <= 60) {
    ending =
      'As a trailblazer, your approach to a challenge is “code first, ask questions later”. No problem will hold you hostage. You will get to a solution as quickly as you can and worry about the consequences later, if there are any. \nIn a team, you help by… Keeping people moving in the right direction. Getting the code to work. And, solving challenging problems as soon as they appear. \nYou can sharpen your skills by focusing on: \nTest Driven Development, to ensure your code works all the time, \nPair Programming, learning how to explain your solution to someone else. \nSnag your free preparation resources. Tips, tricks and content to ace your entry challenge...';
  } else {
    ending =
      'You are the brains of the operation. You know what is needed before any code has been written. You have a plan of action ready and want to understand the code as deeply as possible. You are the sage of any group.\nIn a team, you help by anticipating problems that will arise as you build a project, \nYou help explain the code you and others have written broadening others learning, \nand by using creative solutions to solve code in a more efficient and effective way.\nTo deepen your understanding:\nPair programming will help you see things from a different perspective,\nTDD will ensure that your solutions do work the way you intend!\nSnag your free preparation resources. Tips, tricks and content to ace your entry challenge...';
  }
  document.getElementById('input').style.display = 'block';
  showHighScores();
  setScreen(ending, ['Play again'], restart);
};

const showHighScores = () => {
  fetch('https://untitled-northcoders-game.herokuapp.com/highscores')
    .then((res) => res.json())
    .then((scores) => {
      scores.forEach((score) => {
        const scoreDiv = document.createElement('div');
        scoreDiv.textContent = `Name: ${score.name}. Score: ${score.score}`;
        highscores.appendChild(scoreDiv);
      });
    });
};

const displayScore = (score) => {
  scoreDiv.textContent = ``;
};

const output = (text) => console.log(text);

const createScenario = (text, options) => ({ text, options });
const createOption = (text, outcome, next, scoreChange = 0) => ({
  text,
  outcome,
  next,
  scoreChange,
});

const scenarios = {
  wake_up: createScenario(
    "Greetings Agent X. We have a new mission for you. We've detected a mysterious signal broadcasting out to space in central Manchester. It seems to be coming from Northcoders - a tech bootcamp organisation. Your mission is to infiltrate Northcoders and find out who has set off the signal. The safety of the Earth could depend on it. Are you ready to start?",
    [createOption('Accept mission', '', 'precourse')],
  ),

  precourse: createScenario(
    'You’ve been given some tasks to do before you start at Northcoders. Your first desire is...',
    [
      createOption(
        'Do it all in one day, you have the need for speed.',
        'You blitz out all the pre-course in 20 hours, you learn a lot and feel better prepared for the course, but you stumbled across an out of place letter… “R”',
        'mission_start',
        6,
      ),
      createOption(
        'Join the slack channels and code along with other Northcoder starters.',
        'You chat among the slack channels as you work through the problems… Someone posts about a weird letter cropping up, a single letter “R”',
        'mission_start',
        2,
      ),
      createOption(
        'Delve into documentation to solve all these new challenges.',
        'You digest all the docs you can to solve the problems effectively… However, in your brilliant solutions, you stumble across the rogue letter “R”',
        'mission_start',
        4,
      ),
      createOption(
        'Carefully examine the tasks, breaking them down into smaller workloads to do each day.',
        'You review and break down the repo into chunks, as you work through it on a daily basis, you see the letter “R” in a weird place...',
        'mission_start',
        8,
      ),
    ],
  ),

  mission_start: createScenario(
    'Your first task is to disguise yourself as a typical Northcoders student. Which outfit will help you blend in best?',
    [
      createOption(
        'Comfort-first - patterned cardigan, joggers and some thick framed glasses.',
        'You arrive for your first day to find you fit in perfectly. In fact, the students there are wearing everything from an animal print onesie to a three piece suit. What is this strange place where everyone feels at home? Time to investigate!',
        'zoom_static',
        8,
      ),
      createOption(
        'Dressed to impress - here to make an impression, you don your finest evening wear',
        'You arrive for your first day to find you fit in perfectly. In fact, the students there are wearing everything from an animal print onesie to a three piece suit. What is this strange place where everyone feels at home? Time to investigate!',
        'zoom_static',
        6,
      ),
      createOption(
        "Practical - The weather's wild, it's time for some winter boots, woolly tights and a jazzy bobble hat.",
        'You arrive for your first day to find you fit in perfectly. In fact, the students there are wearing everything from an animal print onesie to a three piece suit. What is this strange place where everyone feels at home? Time to investigate!',
        'zoom_static',
        4,
      ),
      createOption(
        'Coder-uniform - tee, branded hoody and some blue jeans, silicon valley eat your heart out',
        'You arrive for your first day to find you fit in perfectly. In fact, the students there are wearing everything from an animal print onesie to a three piece suit. What is this strange place where everyone feels at home? Time to investigate!',
        'zoom_static',
        2,
      ),
    ],
  ),
  zoom_static: createScenario(
    'Someone posts a zoom link in slack. You dial in and find yourself in a lecture on the fundamentals of programming. As you slip your headphones on you hear a mysterious static in the background of the lecture. What do you do?',
    [
      createOption(
        'Turn the volume up, it sounds like it is “saying” something,',
        "You whack the volume up. It sounds like the cast of Lord of the Rings all chanting 'A! A! A!'. This could be a clue! You write it down in your notebook.",
        'lecture',
        4,
      ),
      createOption(
        'Scan through the faces to see who is unmuted',
        'You flick through the names, and see the static culprit, you search for them on slack to only see the letter “A” instead of their name…',
        'lecture',
        6,
      ),
      createOption(
        'Post a message to the chat asking if anyone else can hear it',
        'Your message grabs the attentions of the culprit! The static stops and they quickly type their apology… Their name, a single “A”,',
        'lecture',
        2,
      ),
      createOption(
        'Wait for someone else to mention the horrible ear music',
        'You wait. Almost instantly a tutor asks for the person with the username “A” to turn off their mic… Interesting...',
        'lecture',
        8,
      ),
    ],
  ),
  // distracted: createScenario(
  //   "You copy and paste the url into your browser and type in the password - you're in! You see a jumble of code and information on the screen in front of you but one button jumps out at you: master sketchbook settings...",
  //   [
  //     createOption(
  //       'close the window',
  //       "You lose your nerve and close the window. You make a cup of tea to calm yourself and by the time it's brewed it's time for the lecture to begin.",
  //       'lecture',
  //     ),
  //     createOption(
  //       'change the settings',
  //       'You open up the master sketchbook settings and change the default colour to lime green and the style to caligraphy. Chuckling to yourself, you close the browser down and get ready to dial into the lecture',
  //       'lecture',
  //       5,
  //     ),
  //   ],
  // ),

  lecture: createScenario(
    'You see a mysterious symbol in the background on one of the tutor’s zoom screens, what do you do?',
    [
      createOption(
        'Drop them a direct message',
        'Your dm is worded like a court order, in the tutor’s terror they accidently send back an entire email with one letter inside… “T”',
        'tea_break',
        6,
      ),
      createOption(
        'Pin their video, zoom and enhance their picture to see the symbol',
        'Your powerful detective skills let you screenshot and enhance the photo… You’re living the CSI dream. You uncover the letter “T”',
        'tea_break',
        8,
      ),
      createOption(
        'Take a screenshot and send it to your primary school art teacher for more thoughts',
        'You aren’t skilled enough to enhance your screenshot, so you call for reinforcements from you Primary school art teacher. They  message you back in 15 minutes! The letter “T”',
        'tea_break',
        2,
      ),
      createOption(
        'Magically code up some image detecting software to find the source of/translate the symbol',
        'You trust your skills to whip up a image enhancing and source deconstruction algorithm… you create 3 months of code in 15 minutes and reveal the letter “T”',
        'tea_break',
        4,
      ),
    ],
  ),

  tea_break: createScenario(
    "It's tea break time, a moment for everyone to stretch their legs and have a short break from the screen. And for you it's a chance to...",
    [
      createOption(
        'Get a cup of tea from the kitchen',
        'Your thirsty and get your favourite beverage and pour it into a mug. The heat causes the mug to reveal a hidden message, a “H” printed on the side…',
        'kata_time',
      ),
      createOption(
        'Eat some cereal!',
        'You realised that breakfast was only 30 minutes ago and you are STARVING. You copy the hobbits’ idea and break for elevensies, as you pour your cereal, the letter “H” falls from the packet',
        'kata_time',
      ),
        createOption(
          'Talk to one of the tutors as you get a drink of water',
          'You talk to the tutor who is having a nip of vodka, they’re not having a good day. In their drunken haze they spill the beans… You get the letter “H”,',
          'kata_time',
        ),
        createOption(
          'Have a nap on one of the beanbags',
          'Your late night has caught up with you… You go for a nap on the beanbags… Scribbled in the corner of the skirting board, the letter “H”',
          'kata_time',
        ),
      ,
    ],
  ),

  kata_time: createScenario(
    'After the lecture, the tutor team give you a list of problems to solve… But you can’t focus on them just yet, you have to find the inside source. Do you…',
    [
      createOption(
        'Call Northcoders Help Line (NCHelp) and interrogate the tutors?',
        'After a short while, a couple of tutors show up on your zoom call. You give them the Spanish Inquisition about the strange goings on. They\'re no match for your questioning. You learn about the next letter “B”...',
        'lunch',
        6,
      ),
      createOption(
        'Complete the katas and look for more clues in the questions?',
        'You’re keen sense of sniffing out clues has rewarded you… A hidden JSON file has the letter “B” inside.',
        'lunch',
        4,
      ),
      createOption(
        'Ask other students about anything strange happening at Northcoders?',
        'You see a few students who have been on the course for longer, you strike up a conversation and ask them if they have seen anything strange. They say there was a big “B” in the office when they started…',
        'lunch',
        2,
      ),
      createOption(
        'Sit and ponder the evidence you have, narrowing down your list of suspects',
        'As you sit, scratching your head, inspiration hits! A giant pillow has crashed into you, no time to worry about who threw it… The next clue, a “B”...',
        'lunch',
        8,
      ),
    ],
  ),

  lunch: createScenario(
    'Your efforts are getting you closer to the right person, although there is still so much left to solve… Your stomach growls. 1pm. Lunch is here… But we still need to crack this case. You...',
    [
      createOption(
        'Wait for the tutors to leave and rummage through their belongings to find clues',
        'After breaking the law on numerous occasions, you finally find what you are looking for… A 30cm, gold plated “O”, one step closer to the source (and riches!)...',
        'seminar_grp',
        6,
      ),
      createOption(
        'Leave with the tutors and wait for any slips of the tongue',
        'You join the tutors for lunch, but they’re tongue tied… Tequila is the solution on this occasion. You get the tutors drunk and they fumble out the letter “O”...',
        'seminar_grp',
        2,
      ),
      createOption(
        'Continue with the katas, there may be more information hidden in them',
        'You wade through the kata’s, knowing there must be a clue somewhere. And there is, hidden deep in the testing file the letter “O”. No one would’ve checked there!',
        'seminar_grp',
        4,
      ),
      createOption(
        'Investigate your suspects on the internet and police database',
        'You know research is the key, you crack out your usernames and passwords. The tutors can’t hide from your sleuthing skills. On the police database, an unusual suspect associated with Northcoders… The letter “O”.',
        'seminar_grp',
        8,
      ),
    ],
  ),

  seminar_grp: createScenario(
    "You're attending a seminar session with your fellow mentees. A tutor is walking everyone through the solution of a difficult problem from today, you decide to participate by…",
    [
      createOption(
        'Giving any answer before anyone else, you must be first, who cares if it\'s right or wrong',
        'You deliver answer after answer before anyone else. Your quick typing gets you ahead of everyone else. You’re sure that everyone knows who is best!',
        'extra_kata',
        6,
      ),
      createOption(
        'Answering other people’s questions in chat',
        'After noticing a few people struggling, you help them by giving some detailed answers to solidify their understanding. They’re grateful for your help.',
        'extra_kata',
        4,
      ),
      createOption(
        'Pasting a code snippet into chat that you’ve built alongside the lecture',
        'You code alongside the zoom call, building your tests as well. Once you have written a water-tight function, you paste your code into chat, the tutors congratulate you on your coding prowess.',
        'extra_kata',
        8,
      ),
      createOption(
        'Engage in casual coding conversation in the chat',
        'You engage with others in the chat, sharing jokes, and finding common ground whilst learning about the solution, you follow a link to some cat memes! Good times :P',
        'extra_kata',
        2,
      ),
    ],
  ),

  extra_kata: createScenario(
    'Looking through the files you come across a variable called “doNotDelete”, so naturally your first instinct is to…',
    [
      createOption(
        'Console.log() the variable and see what it is',
        'You wrap console.log() around the variable and run the file. A string appears in the terminal… an endless list of “N”s…',
        'round_up',
        8,
      ),
      createOption(
        'Ask other students if they have seen this variable and what’s inside it',
        'You ask a few coders next to you, they tell you that it broke their work by replacing every character of their code with an “N”.',
        'round_up',
        2,
      ),
      createOption(
        'Test the variable to see if it is safe and useful',
        'You construct some tests, not knowing how deep this problem could go. Your tests work where each character of your tests is replaced with an "N"',
        'round_up',
        4,
      ),
      createOption(
        'Delete the variable, worry about the consequences later',
        'You delete the variable, time to have some fun! You run the file and everything crashes. As you reload your file, every character is now an "N"...',
        'round_up',
        6,
      ),
    ],
  ),

  round_up: createScenario(
    "It's the end of the day and the tutors have called for a round up to see how everyone's found the day. You decide to...",
    [
      createOption(
        'Join the Zoom call and dig for more info from the tutors.',
        'Gotcha! You get a tutor chatting in the roundup and they accidentally let slip the final letter... it\'s an "E".',
        'reveal',
        2,
      ),
      createOption(
        'Continue coding to find any hidden clues in the code',
        "You crack on with the code, determined to find that final letter and as you’re wrapping up the last challenge of the sprint, you find the final letter hidden... \"E\"",
        'reveal',
        4,
      ),
      createOption(
        'Research all the staff of Northcoders to deduce the culprit',
        'You scour the Northcoders website, only one name matches all the letters so far. You deduce the final letter..."E"',
        'reveal',
        8,
      ),
      createOption(
        'Go to the tutors and challenge them on the evidence you have collected',
        'You storm over to the tutors and you engage in a healthy argument. You probe them about everything you’ve found ("All the evidence is against you!”) and under the pressure they relent. The final letter is ... "E"',
        'reveal',
        6,
      ),
    ],
  ),
  reveal: createScenario(
    'You piece together all the disjointed letters you’ve discovered… They spell out 1 name…\nRATHBONE…\nJonny, hearing his name being called from miles away, calls you on zoom... \n“We’ve been watching you. The true purpose of this adventure was to understand your coding style…”\nYou’ve been soul-searching for so long, and are relieved to have finally found your true coding style. The one and only truth.\nDo you find out and discover a world outside of Microsoft Windows… or, keep the information in Pandora’s box...',
    [createOption('personality results', '', null)],
    [createOption('Keeping it hush', '', null, -100)],
  ),
};

/*
 - Reveal tutor 
 - Reveal results

*/

handleScenario("wake_up");

