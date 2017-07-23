var contextList = ["selection","link","page"];


function display_last_update2() {
  chrome.storage.sync.get(function(fetch) {
    if (fetch.store_last_sync) {
      $("#display_last_update").text("Last Save : " + fetch.store_last_sync);
    } else {
      $("#display_last_update").text("Last Save : N/A");
    }
  });
}


for( i = 0 ; i < contextList.length +1; ++i)
{
    var context = contextList[i];
    var titleX = "Clipper : Save this "+ context + " to Note";
    chrome.contextMenus.create({
        title: titleX, 
        contexts:[context], 
        onclick: save_to_note,
        id : context
    });
}

function save_to_note(data){
    console.log("Here");    
    var d = $("#edit_notepad").value;
    if(data.menuItemId == 'selection')
    {
        var temp = d + " " +data.selectionText;
        console.log(temp);
        $("#edit_notepad").value = temp; 
    }
    else if(data.menuItemId == 'link')
    {
        var temp = d + " " + data.linkUrl;
        $("#edit_notepad").value = temp;
    }
    store();
    display_last_update2();
}
    
