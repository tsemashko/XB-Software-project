var table = {
    view:"datatable",
    id: "table",
    autoConfig:true,
    data: info,
    scrollX: false,
};

var header = {
    view: "toolbar",
    cols:[
        {
            view: "label",
            label: "My App",
            gravity: 0.8

        },
        {
            view: "button",
            type: "icon",
            label: "Profile",
            icon: "wxi-user",
            id: "user-btn",
            gravity: 0.2,
            autowidth: true,
            click: function(){
                popup.show($$("user-btn").getNode());
            },
            popup: "popup"
        }
    ]
};

var left_side = { 
    type: "clean",
    rows:[ 
        {
            view:"list",
            id:"mylist",
            scroll:false,
            width:200,
            data:[ "Dashboard", "Users", "Products", "Locations" ],
            gravity:0.45
        },
        {
            template:"html->connected",
            gravity: 0.55,
            css: {"text-align":"center"},
            autoheight: true
        }
    ]
  };


var form = {
    view:"form", 
    id: "form",
    scroll:false,
    width:300,
    rules:{
        title:webix.rules.isNotEmpty,
        year: (value) => {return value > 1970 && value < 2019},
        votes: (value) => {return value < 100000},
        rating: (value) => {return value !== 0 && value !== ""}
    },
    elements:[
        {view: "template", template: "Edit films", type: "section"},
        { view:"text", name:"title", label:"Title", invalidMessage: "The title must be filled in"},
        { view:"text", name:"year", label:"Year", invalidMessage: "The year must be 1970-2019"},
        { view:"text", name:"rating", label:"Rating", invalidMessage: "The votes must be < 100000"},
        { view:"text", name:"votes", label:"Votes", invalidMessage: "The rating can't be empty or 0"},
        { margin:5, cols:[
            { view:"button", label:"Add new" , type:"form", click: addFilm},
            { view:"button", label:"Clear", click: clearForm }
        ]},
        {}
    ]
};

webix.ui({
    rows:[
        header,
        {
            cols:[
                left_side, {view:"resizer"}, table, form
            ]
        },
        {
            view:"template", 
            template:"The software is provided by <a href='https://webix.com'>https://webix.com</a>. All rights reserved (c).",
            css: {"text-align":"center"}, 
            autoheight: 1
        }  
    ]   
  });

  var popup = webix.ui({
      view: "window",
      id: "popup",
      headHeight:0,
      width:300,
      height:69,
      autoheight: true,
      body:{
          view: "list",
          data:[
              "Settings", "Log Out"
          ],
          scroll: false,
          select: true
      },
  });



function addFilm() {
    if ($$("form").validate()) {
        $$("table").add($$("form").getValues());
        webix.message("Successful adding");
        $$("form").clear();
    }
};

function clearForm() {
    webix.confirm({
        title: "Clearing form",
        text: "Are you sure you want to clear form?",
        callback(result) {
            if (result) {
                $$("form").clear();
                $$("form").clearValidation();
            }
        }
    });
};


 
