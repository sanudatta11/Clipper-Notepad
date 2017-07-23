function display_last_update() {
  chrome.storage.sync.get(function(fetch) {
    if (fetch.store_last_sync) {
      $("#display_last_update").text("Last Save : " + fetch.store_last_sync);
    } else {
      $("#display_last_update").text("Last Save : N/A");
    }
  });
}

var delay_instance = (function() {
  var timer = 0;
  return function(callback, ms) {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();

function store() {
  delay_instance(function() {
    var d = new Date();
    chrome.storage.sync.set({
      'store_data': $("#edit_notepad").val(),
      'store_last_sync': d.getDate() + "-" + (d.getMonth() + 1) + "-" +
        d.getFullYear() + " " + ' | ' + " " + d.getHours() + ':' + d.getMinutes() +
        ':' + d.getSeconds()
    });
    $("#display_last_update").fadeOut(200).delay(1300).fadeIn(100);
    
    $("#autosaver").text("Saved").fadeIn(300).delay(1000).fadeOut(200);
    display_last_update();
  }, 1500);
  
}
display_last_update();



var titleX = "Clipper : Save this selection to Note";
chrome.contextMenus.create({
     title: titleX, 
     contexts:["selection"], 
     onclick: save_to_note,
     id : "selection123"     
});


function save_to_note(data){
    console.log("Here");    

    chrome.storage.sync.get("store_data",function(obj){
        //console.log(obj);
        d1 = obj.store_data;
        //console.log("Prev="+ d1);
        var temp = d1 + " " +data.selectionText;
        //console.log("Temp="+temp);
        var d = new Date();
        chrome.storage.sync.set({
        'store_data': temp,
        'store_last_sync': d.getDate() + "-" + (d.getMonth() + 1) + "-" +
            d.getFullYear() + " " + ' | ' + " " + d.getHours() + ':' + d.getMinutes() +
            ':' + d.getSeconds()
        });
        d1 = temp;
        display_last_update();
    });
    
}


chrome.storage.sync.get(function(fetch) {
  $("#edit_notepad").val(fetch.store_data);
  $("#edit_notepad").caret(fetch.caret_position);
});

$("#edit_notepad").on("keyup click", function() {
  chrome.storage.sync.set({
    'caret_position': $(this).caret()
  });
});

$('#edit_notepad').on('input', function(e) {
  store();
});

$("#edit_notepad").on("keydown", function(e) {
  var key_code = e.key_code || e.which;
  var t = $(this);
  if (key_code == 9) {
    e.preventDefault();
    var start = t.get(0).selectionStart;
    var end = t.get(0).selectionEnd;
    t.val(t.val().substring(0, start) + "\t" + t.val().substring(end));
    t.get(0).selectionStart = t.get(0).selectionEnd = start + 1;
    store();
  }
});

//save notes as .txt
$("#save_button").on("click", function(event) {
  event.preventDefault;

  var $save_button = $("#save_button");
  var $edit_notepad = $("#edit_notepad").val().replace(/\n/g, '\r\n');

  if ($edit_notepad == "" || $edit_notepad == "None Found") {
    $save_button.attr("href", "#");
    $save_button.removeAttr("download");
  } else {
    $save_button.attr("href", "data:text/plain;base64," + btoa($edit_notepad));
    $save_button.attr("download", "Clipper");
  }
});

$("#reset_button").on("click", function(event) {
  event.preventDefault;
  var r = confirm("Reset Local Storage?");
  if(r==true)
  {
      chrome.storage.sync.set({ "edit_notepad" : "" }, function() {
        if (chrome.runtime.error) {
                console.log("Runtime error.");
                $("#autosaver_overlay").text("Reset Failed").fadeIn(200).delay(2000).fadeOut(200);
        }
        else{
            document.getElementById("edit_notepad").value = "";
            store();
            $("#autosaver_overlay").text("Reset").fadeIn(200).delay(2000).fadeOut(200);
         }
    });
  }
});



document.getElementById("sync_button").onclick = function() {
  var d = document.getElementById("edit_notepad").value;
  store();
  $("#autosaver_overlay").text("Saved").fadeIn(200).delay(2000).fadeOut(200);
  $("#manualsyncer").text("Synced").fadeIn(200).delay(1000).fadeOut(200);
  display_last_update();
  if (chrome.runtime.error) {
    console.log("Runtime error.");
  }
}

document.body.onload = function() {
  chrome.storage.sync.get("edit_notepad", function(items) {
    if (!chrome.runtime.error) {
      //console.log(items);
      document.getElementById("edit_notepad").innerText = items.edit_notepad;
    }
  });
}


$('#less_size').on('click',function(){
    if(parseInt($('#edit_notepad').css('height'), 10) > 350)
    {
        $("body").width(function(i, w) { return w - 20; });
        $("body").height(function(i, w) { return w - 20; });
        $("#edit_notepad").width(function(i, w) { return w - 20; });     
        var currentsize  = $('.headings').css('font-size');
        $('.headings').css('font-size',parseInt(currentsize)-2);
    }
});

$('#more_size').on('click',function(){
    
    if(parseInt($('#edit_notepad').css('height'), 10) <= 500)
    {
        $("body").width(function(i, w) { return w + 20; });
        $("body").height(function(i, w) { return w + 20; });
        $("#edit_notepad").width(function(i, w) { return w + 20; });   
        var currentsize  = $('.headings').css('font-size');
        $('.headings').css('font-size',parseInt(currentsize)+2);
    }
});

    

