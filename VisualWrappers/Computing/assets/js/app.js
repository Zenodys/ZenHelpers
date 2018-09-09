if (window.module) module = window.module;

const ipcRenderer = require('electron').ipcRenderer;
//***********************************//


JSON_Reader("ui-config.json").done(function (data) {
  ControlPanel(data);
})

function ControlPanel(data) {


  // variables
  let console_output_counter = 0;
  let isEngineStarted = false;
  let $engineToggle = $("#startEngineToggle");
  let $status = $(".status-light");
  let $visualisations = $('#visualisations');
  let read_etherum_wallet = ReadAddress();
  let $ethWallet = $('#txtAddress');
  let engineUptime = new uptime();
  let $cleanConsoleBtn = $("#console-clear");
  let $console = $("#message");
  let $saveAddressBtn = $('#saveAddress');
  let frequency = data.frequency;
  let quote = data.quote;
  let isQuoteReached = fs.readFileSync(path.join(__dirname, "quote-reached")).asciiSlice();




  $("#quote").html(quote);


  // functions
  html = (a) => {
    return `<span><strong class="radius secondary float-right">${moment().format('hh:mm:ss a')}</strong> ${a}<span>`;
  }


  let p_bar = new p_animation(".progress-bar-fill", frequency);


  onUpdateEngine = (state) => {
    if (state) {
      console_output_counter++;
      console.log(console_output_counter)
      isEngineStarted = true;

      $engineToggle.removeClass("success").addClass("alert").html("Stop");
      $status.addClass("running").html("Running");
      $visualisations.removeClass("disabled");
      engineUptime.start();

      if (!uptimeMemory.exists()) {
        uptimeMemory.set();
      }


      $console.stop().animate({
        scrollTop: $console[0].scrollHeight
      }, 0);

      $saveAddressBtn.addClass('disabled');
      $ethWallet.prop('disabled', true);


    } else {
      engineStopStatus();
    }
  }


  function engineStopStatus() {
    isEngineStarted = false;
    $engineToggle.removeClass("alert").addClass("success").html("Start");
    $status.removeClass("running").html("Stopped");
    $visualisations.addClass("disabled");
    engineUptime.stop();

    uptimeMemory.clear();
    $saveAddressBtn.removeClass('disabled');
    $ethWallet.prop('disabled', false);
    console_output_counter = 0;
    p_bar.stop();
  }

  // init
  if (read_etherum_wallet !== null && read_etherum_wallet.asciiSlice() !== "") {
    $engineToggle.removeClass("disabled");
    $ethWallet.val(read_etherum_wallet);

  }


  if (isQuoteReached !== "" && isNaN(isQuoteReached) == false && isQuoteReached == quote) {
    $("#earnings").html(isQuoteReached);
    $engineToggle.addClass("disabled").addClass("quote-reached");
  }


  // events
  $engineToggle.on('click', (e) => {
    e.preventDefault();


    if (!$engineToggle.hasClass("disabled")) {
      if ($engineToggle.hasClass("alert")) {
        ipcRenderer.send("stopEngine");
      }


      if ($engineToggle.hasClass("success") && !$engineToggle.hasClass("alert")) {
        ipcRenderer.send("startEngine");

      }
    } else if ($engineToggle.hasClass("disabled") && !$engineToggle.hasClass("quote-reached")) {

      alert("You must first enter a valid ETH address");
    } else if ($engineToggle.hasClass("disabled") && $engineToggle.hasClass("quote-reached")) {
      alert("Good job. Quote already reached.");
    }

  });



  $cleanConsoleBtn.on('click', function (e) {
    e.preventDefault();
    $console.html("");
  });


  $visualisations.on('click', function () {
    if (!$visualisations.hasClass("disabled")) {
      ipcRenderer.send("showVisualisations");
    }
  });


  $saveAddressBtn.on('click', (e) => {
    e.preventDefault();

    if (!$saveAddressBtn.hasClass("disabled")) {
      if (ethereum_address.isAddress($ethWallet.val())) {
        fs.writeFile(path.join(__dirname, "ZenEngine\\address"), $ethWallet.val(),
          function (err) {
            if (err)
              alert('Error in saving address!');
            else
              alert("Address saved.");
            $engineToggle.removeClass("disabled");
          });
      } else {
        alert('Not a valid Ethereum (ETH) wallet address. Please check your address.');
        $ethWallet.val(read_etherum_wallet);
      }

    } else {
      alert(
        "Can't change ETH address while Zen Engine is running. To change ETH address please stop Zen Engine first."
      )
    }
  });


  //*******************   END ZEN ENGINE EVENT HANDLERS ****************//

  ipcRenderer.on('onZenEngineCount', (event, param) => {

    if (console_output_counter == 1) {
      p_bar.start();
    }

    if (param <= quote) {
      $("#earnings").html(param);

    }
    // Stop engine when quote is reached
    if (param == quote) {
      ipcRenderer.send("stopEngine");
      engineStopStatus();

      if (!$engineToggle.hasClass("quote-reached")) {
        $engineToggle.addClass("disabled").addClass("quote-reached");
      }

      fs.writeFile(path.join(__dirname, "quote-reached"), param,
        function (err) {
          if (err) {
            alert('Could not write to file.');
          } else {
            alert("Quote reached. Zen Engine will stop.");
          }
        });



    } else if (param >= quote) {
      engineStopStatus();
      $engineToggle.addClass("disabled").addClass("quote-reached");
      $("#earnings").html(quote);

    }


  });

  ipcRenderer.on('onZenEngineOutput', (event, param) => {
    $console.append(html(param) +
      "<br/>"
    );
    onUpdateEngine(true);
  });

  ipcRenderer.on('onZenEngineExit', (event, param) => {
    $console.append("Engine process exited.....<br/>");
    onUpdateEngine(false);
  });

  ipcRenderer.on('onZenEngineError', (event, param) => {
    $console.append("Engine process throw error.....<br/>" + param);
    onUpdateEngine(true);
  });


  // On electron exit
  if (isEngineStarted) {
    // on window reload stop!
    window.onbeforeunload = (e) => {
      ipcRenderer.send("stopEngine");

    }
  }

};




var uptimeMemory = {
  set: function () {
    fs.writeFile(path.join(__dirname, "engine"), moment.now(), function (err) {

    });
  },

  get: function () {
    return parseInt(fs.readFileSync(path.join(__dirname, "engine")).asciiSlice());
  },

  exists: function () {
    if (fs.readFileSync(path.join(__dirname, "engine")).asciiSlice().length > 0) {
      return true;
    } else {
      return false;
    }
  },

  clear: function () {
    fs.writeFile(path.join(__dirname, "engine"), "", function (err) {

    });
  }
}


function ReadAddress() {
  if (!fs.existsSync(path.join(__dirname, "ZenEngine\\address")))
    return null;

  return fs.readFileSync(path.join(__dirname, "ZenEngine\\address"));
}


function JSON_Reader(url) {
  var d = new $.Deferred();
  $.ajax({
    type: "POST",
    url: url,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (data) {
      d.resolve(data);
    },
    error: function () {
      d.reject();
    }
  });
  return d.promise();
}


function uptime() {
  let counter = 0;
  let runClock = null;
  let time = null;
  let $uptimeTicker = $(".uptime-ticker");
  let uptimeMemoryCheck = false;


  function displayTime() {

    if (uptimeMemory.exists() && uptimeMemoryCheck == false) {


      let now = moment().format('DD/MM/YYYY HH:mm:ss');
      let then = moment(uptimeMemory.get()).format('DD/MM/YYYY HH:mm:ss');
      let ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
      let d = moment.duration(ms);

      counter = d.asSeconds();

      time = moment().hour(0).minute(0).second(counter).format('HH : mm : ss');
      //console.log(time);
      $uptimeTicker.html(time);
      uptimeMemoryCheck = true;
    } else {
      time = moment().hour(0).minute(0).second(counter++).format('HH : mm : ss');
      $uptimeTicker.html(time);
    }



  }

  this.start = function () {
    if (runClock == null) {
      runClock = setInterval(displayTime, 1000);
      engineStart = moment.now();


    }
  }

  this.stop = function () {
    clearInterval(runClock);
    $uptimeTicker.html("00 : 00 : 00");
    runClock = null;
    time = null;
    uptimeMemoryCheck = false;
  }
}




function WriteFile(path, data) {

}


// progress
var p_animation = function (bar, _f) {

  let $bar = $(bar);
  let fr = 100 / (_f - .5);
  let progressBar = 0;
  let t = null;
  let _self = this;


  this.start = function () {

    t = setInterval(function () {
      progressBar = progressBar + fr;
      //console.log(progressBar)
      $bar.css({
        "width": progressBar + "%"
      });

      if (progressBar > 100) {
        clearInterval(t);
        progressBar = 0;
        $bar.css({
          "width": 0 + "%"
        });
        t = null;
        _self.start();
      }
    }, 1000);
  }


  this.stop = function () {
    clearInterval(t);
    progressBar = 0;
    $bar.css({
      "width": 0 + "%"
    });
    t = null;
  }
}