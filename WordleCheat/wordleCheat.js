
window.onload = () => {
  const charCorrectPlaceIds = [
    "charCorrectPlace_0",
    "charCorrectPlace_1",
    "charCorrectPlace_2",
    "charCorrectPlace_3",
    "charCorrectPlace_4",
  ];
  const charWrongPlaceIds_rowcol = [
    "charWrongPlace_00",
    "charWrongPlace_01",
    "charWrongPlace_02",
    "charWrongPlace_03",
    "charWrongPlace_04",

  ];
  const legalLetters = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
  const UNKNOWN_LETTER = "_";

  var allWords = [];

  const getWrongPlaceId = (row, col) => {

    const res = `charWrongPlace_${row}${col}`;
    return res;
  }

  const getAllWrongPlaceElements = () => {

    const resEls = [];
    for (let row=0; row<=3; row++) {
      for (let col=0; col<=4; col++) {
        const elName = getWrongPlaceId(row, col);
        const el = document.getElementById(elName);
        resEls.push(el);
      }
    }
    return resEls;
  }

  const getAllCorrectPlaceElements = () => {
    const resEls = [];
    charCorrectPlaceIds.forEach( (name) => {

      const el = document.getElementById(name);
      resEls.push(el);
    });
    return resEls;
  }

  const getAllInputElements = () => {
    
    const res = [];
    res.push(...getAllWrongPlaceElements());
    res.push(...getAllCorrectPlaceElements());
    res.push(document.getElementById('charDeadInWord'));
    return res;
  }

  const setupEventListeners = () => {

    // clear button
    const elClearBtn = document.getElementById('clear_all');
    elClearBtn.addEventListener('click', (ev) => {
      const allEls = getAllInputElements();
      allEls.forEach((el) => {
        el.value = '';
      });
      showFilteredWords();
    });

    // correct place text changes
    getAllCorrectPlaceElements().forEach( (el) => {

      el.addEventListener("input", (ev) => {
        charCorrectPlaceChange(el);
      });
    });

    getAllWrongPlaceElements().forEach( (el) => {

      el.addEventListener("input", (ev) => {
        charWrongPlaceChange(el);
      });
    });

    // dead letters
    const elDead = document.getElementById('charDeadInWord');
    elDead.addEventListener("input", (ev) => {
      charDeadChanged(elDead);
    })
  }

  const doesntHaveLetters = (letters, word) => {

    const l = [...letters].filter( x => word.includes(x) );
    console.log(`letters:"${letters}", word:"${word}", filter:"${l}"`)

    const intersection = new Set(l);
    return intersection.size == 0;
  }

  const isSubset = (letters, word) => {
    const sUnion = new Set([...letters, ...word]);
    sUnion.delete(UNKNOWN_LETTER);
    return word.length == sUnion.size; // didn't add any new data from subset
  }

  const isWordAMatch = (letters, possWord) => {

    if (letters.length != possWord.length) {
      return false;
    }

    bMatches = true;
    for (let n = 0; n < letters.length; n++) {
      const ch = letters.charAt(n);
      if (ch != UNKNOWN_LETTER) {
        bMatches &= (ch == possWord.charAt(n));
      }
    }
    return bMatches;
  };

  // const isEmpty = (letters) => {

  //   bHasChar = false;
  //   for (let ch of letters) {
  //     bHasChar |= ch != UNKNOWN_LETTER;
  //   }
  //   return !bHasChar;
  // };

  // const getCorrectPlaceMatchWords = (lettersCorrectPlace, lettersWrongPlace, possibleWords) => {

  //   var result = [];
  //   if (isEmpty(lettersCorrectPlace)) {

  //   } else {
  //     if ((possibleWords.length != 0) && (lettersCorrectPlace.length != 0)) {
  //       // reduce all the possible words to those with all the letters
  //       // const sLetters = new Set(letters);

  //       possibleWords.forEach((word) => {

  //         if (isWordAMatch(lettersCorrectPlace, word)) {

  //           if (isSubset(lettersWrongPlace, word)) {
  //             result.push(word);
  //           }
  //         }
  //       });
  //     }
  //   }
  //   return result;
  // }

  // const getWrongPlaceMatchWords = (letters, possibleWords) => {

  //   var result = [];
  //   if (!isEmpty(letters)) {
  //     if (possibleWords.length != 0 && letters.length != 0) {

  //       possibleWords.forEach((word) => {

  //         if (isSubset(letters, word)) {
  //           result.push(word);
  //         }
  //       });
  //     }
  //   }
  //   return result;
  // }

  // const getWordsWithoutLetters = (letters, possibleWords) => {

  //   var result = [];
  //   possibleWords.forEach(word => {

  //     if (doesntHaveLetters(letters, word)) {
  //       result.push(word);
  //     }
  //   }) 
  //   return result;
  // }

  const getDeadLetters = () => {

    const el = document.getElementById('charDeadInWord');
    return el.value;
  }

  const getUserPlacedLetters = (ids) => {
    var letters = "";
    ids.forEach((elName) => {
      const el = document.getElementById(elName);
      const ch = el.value;
      if (ch.length == 1 && legalLetters.includes(ch)) {
        letters += ch;
      } else {
        letters += UNKNOWN_LETTER;
      }
    });
    return letters;
  };

  const getWrongPlaceColumnLetters = (col) => {

    var letters = "";
    for (let row=0; row<=3; row++) {

      const elName = getWrongPlaceId(row, col);
      const el = document.getElementById(elName);
      const ch = el.value;
      if ((ch.length==1) && (ch != UNKNOWN_LETTER)) {
        letters += ch;
      }
    }
    return letters;
  }


  const filterCorrectPlace = (words, letters) => {

    const result = [];
    words.forEach( (w) => {

      if (isWordAMatch(letters, w))
        result.push(w);
    });
    return result;
  }

  const filterDeadLetters = (words, letters) => {

    const result = [];
    words.forEach( (w) => {

      if (doesntHaveLetters(letters, w))
        result.push(w);
    });
    console.log(`Dead-Filter:  ${letters}, words:${words.length} => ${result.length}`);

    return result;
  }

  const filterWrongPlaceLetters = (words, colLetters, nColumn) => {

    // each letter must be in the word BUT not at the indicated column
    // however if the column is empty then all words are possible
    if (colLetters.length == 0) {
      return words;
    }

    // check each letter is in the word, but not at this column
    const possibleWords = [];
    words.forEach( (w) => {

      const charAtCol = w.charAt(nColumn);
      if (!colLetters.includes(charAtCol)) {

        var bIsGood = true;
        for (let n=0; n<colLetters.length; n++) {

          const ch = colLetters.charAt(n);
          if (!w.includes(ch)) {
            bIsGood = false;
          }
        }

        if (bIsGood) {
          possibleWords.push(w);
        }
      }
    });
    return possibleWords;
  }

  const getFilteredWords = () => {

    // letters in correct place
    var possWords = filterCorrectPlace(allWords, getUserPlacedLetters(charCorrectPlaceIds));

    // letters that are DEAD ie not in the word
    possWords = filterDeadLetters(possWords, getDeadLetters());

    // letters that are correct but we don't know their location
    // run through each column and remove words that have the columns
    // letter(s) at that column location
    // ie if there is an 'a' but it's not the first letter
    // remove words that start with 'a'
    for (let col=0; col<=4; col++) {
      const colLetters = getWrongPlaceColumnLetters(col);
      possWords = filterWrongPlaceLetters(possWords, colLetters, col);
    }

    return possWords;
  }

  const showFilteredWords = () => {

    const filteredWords = getFilteredWords().join(', ').toLowerCase();
    const elPossibleWords = document.getElementById('possible-words');
    elPossibleWords.innerText = filteredWords
  }

  // const alreadyUsedLetter = (el, possbleEls, ch) => {
  //   bFound = false;
  //   possbleEls.forEach((elName) => {
  //     const elToCheck = document.getElementById(elName);
  //     if (el != elToCheck) {
  //       bFound |= ch == elToCheck.value;
  //     }
  //   });
  //   return bFound;
  // };

  const makeElementSingleCharUpperCase = (el) => {
    if (el != undefined) {
      var ch = el.value.toUpperCase();
      if (ch.length > 1) {
        ch = ch.charAt(ch.length - 1);
      }
      el.value = ch;
    }
  }

  // const charChange = (el, sisterEls) => {

  //   if (el != undefined) {
  //     var ch = el.value;
  //     if (!legalLetters.includes(ch) || alreadyUsedLetter(el, sisterEls, ch)) {
  //       ch = "";
  //     }
  //     el.value = ch;
  //   }
  // }

  const charCorrectPlaceChange = (el) => {

    makeElementSingleCharUpperCase(el);
    // charChange(el, charCorrectPlaceIds);
    showFilteredWords();
  };

  const charWrongPlaceChange = (el) => {

    makeElementSingleCharUpperCase(el);
    showFilteredWords();
  };

  const charDeadChanged = (el) => {

    showFilteredWords();
  }

  const getWords = () => {
    fetch("./words.txt")
      .then((resp) => {
        if (resp.status !== 200) {
          console.error("throwing an error");
          throw new Error(
            `Invalid status code (!= 200) while retrieving ${options.url}: ${resp.status}`
          );
        }
        return resp.text();
      })
      .then((text) => {
        // // display the possible words
        // const re = new RegExp("[\r\n]", "gm");
        // const t = text.replace(re, ", ");

        // store an array of all possible words
        allWords = text.split("\n");
        allWords = allWords.map( x => x.toUpperCase());
        showFilteredWords();
      })
      .catch((err) => {
        console.error(`Error ${err}`);
      });
  };

  const setup = () => {
    if (legalLetters.length != 26) {
      scream();
    }
    setupEventListeners();
    getWords();
    // gtFilteredWords();
  };

  setup();
};
