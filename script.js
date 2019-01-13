var table = {
    view:"datatable",
    id: "table",
    scrollX: false,
    select: true,
    hover: "table-hover",
    onClick: {
        remove(e, id) {
          this.remove(id);
          return false;
        }
      },
    columns: [
        {
          id: "id",
          header: "",
          width: 50,
          sort: "int",
          css: { "background-color": "#F4F5F9" }
        },
        {
          id: "title",
          header: ["Title", { content: "textFilter" }],
          fillspace: 1,
          sort: "string"
        },
        { id: "year", header: ["Released", { content: "textFilter"}], sort: "int" },
        {
          id: "votes",
          sort: (a, b) => {
            return convertVotesToNumber(a.votes) - convertVotesToNumber(b.votes);
          },
          header: ["Votes", { content: "textFilter"}],
        },
        {
          id: "rating",
          header: ["Rating", { content: "textFilter"}],
          sort: "string"
        },
        {template: "<i class='webix_icon wxi-trash remove'></i>", width: 50}
      ],
    on: {
        onAfterSelect: function(id) {
            var data = webix.copy($$("table").getItem(id));
            data = toFormView(data);
            $$("form").setValues(data);
        }
    }
};

var header = {
    view: "toolbar",
    css: "webix_dark",
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
            popup: "popup"
        }
    ]
};

var left_side = { 
    type: "clean",
    css: "menu",
    rows:[ 
        {
            view:"list",
            id:"mylist",
            scroll:false,
            width:200,
            data:[ "Dashboard", "Users", "Products", "Locations" ],
            gravity:0.45,
            select: true,
            on:{
                onAfterSelect:function(id){ 
                  $$(id).show();
              }
            }
        },
        {
            template:"<i class='webix_icon wxi-check' style='color: green'></i> <span  style='color: green'>Connected</span>",
            gravity: 0.55,
            css: "center-align menu",
            autoheight: true,
        },
    ]
  };


var form = {
    view:"form", 
    id: "form",
    scroll:false,
    width:300,
    rules:{
        title: (value) => {return clearTags(webix.rules.isNotEmpty(value))},
        year: (value) => {return clearTags(value) > 1970 && clearTags(value) < 2019},
        votes: (value) => {return clearTags(value) < 100000 && clearTags(value).trim() !== ""},
        rating: (value) => {return clearTags(value) !== "0" && clearTags(value).trim() !== ""}
    },
    elements:[
        {view: "template", template: "Edit films", type: "section"},
        { view:"text", name:"title", label:"Title", invalidMessage: "The title must be filled in"},
        { view:"text", name:"year", label:"Year", invalidMessage: "The year must be 1970-2019"},
        { view:"text", name:"votes", label:"Votes", invalidMessage: "The votes must be < 100000"},
        { view:"text", name:"rating", label:"Rating", invalidMessage: "The rating can't be empty or 0"},
        { margin:5, cols:[
            { view:"button", label:"Add new" , type:"form", click: addFilm},
            { view:"button", value:"Update", type:"form", click: update},
            { view:"button", label:"Clear", click: clearForm }
        ]},
        {}
    ]
};


var usersList = {
    view: "list",
    id: "userslist",
    template: "#name# from #country# <i class='webix_icon wxi-close removeUser'></i>",
    select: true,
    onClick: {
        removeUser(e, id) {
            this.remove(id);
        }
    },
    ready: function(){
        $$("userslist").data.each(function(user){
            if (user.id <= 5)
                user.$css = "first-users";
        });
    }
}

var usersChart = {
    view: "chart",
    id: "userschart",
    type:"bar",
    value:"#age#",
    xAxis:{
        template:"#age#",
        title: "Age"
    }
}

var usersFilter = {
    view: "toolbar",
    elements: [
        {
          view: "text",
          on: {
            onTimedKeyPress() {
              $$("usersList").filter((user) => {
                  return user.name.toLowerCase().indexOf(this.getValue().toLowerCase()) !== -1;
              });
            }
          }
        },
        {
          view: "button",
          value: "Sort asc",
          width: 100,
          type: "form",
          click() {
            $$("usersList").data.sort("name", "asc");
          }
        },
        {
          view: "button",
          value: "Sort desc",
          width: 100,
          type: "form",
          click() {
            $$("usersList").data.sort("name", "desc");
          }
        }
      ]
}

var treeTable = {
    view: "treetable",
    id: "treetable",
    scrollX: false,
    columns: [
        {
          id: "id",
          header: "",
          width: 50
        },
        {
          id: "title",
          header: "Title",
          template: " {common.treetable()} #title#",
          fillspace: true
        },
        {
          id: "price",
          header: "Price",
          width: 200
        }
      ],
      ready: function() {
        this.openAll();
      },
      select: true
}



webix.ui({
    rows:[
        header,
        {
            cols:[
                left_side, {view:"resizer"}, {
                cells: [
                    {id: "Dashboard", cols: [table, form]},
                    {id: "Users", rows:[usersFilter, usersList, usersChart]},
                    {id: "Products", rows:[treeTable]},
                    {id: "Locations", template: "Locations view"}
                ]},
                
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
    view: "popup",
    id: "popup",
    width:300,      
    body:{
        view: "list",
        data:[
            "Settings", "Log Out"
        ],
        scroll: false,
        select: true,
        autoheight: true
    },
});

$$("table").load("data/data.js");
$$("userslist").load("data/users.js");
$$("userschart").load("data/users.js");
$$("treetable").load("data/products.js");

$$("mylist").select("Dashboard");





function toFormView(data){
    data.votes = convertVotesToNumber(data.votes);
    data.rating = data.rating.replace(",", ".");
    return data;
}
function toDatatableView(data){
    if (data.votes.length > 3)
        data.votes = data.votes.slice(0, -3) + "," + data.votes.slice(-3);
    data.rating = data.rating.replace(".", ",");
    return data;
}

function convertVotesToNumber(data){
    const len = data.length - data.indexOf(",") - 1;
    for (var i = 0; i < 3 - len; i++){
        data += "0";
    }
    data = data.replace(",", "");
    return data;
}



function addFilm() {
    
    if ($$("form").validate()) { 
        var values = $$("form").getValues();
        for (var key in values){
            values[key] = clearTags(values[key]);
        }
        values = toDatatableView(values);
        $$("table").add(values);
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

function clearTags(value) {
    var regexp = new RegExp("<[^>]+>([^<>]*)<\/[^><]+>");
    if (value.search(regexp) !== -1)
        value = value.replace(regexp, '$1');
    return value;
}

function update(){
    var sel = $$("table").getSelectedId();
    if(!sel) return;
 
    var value1 = $$('form').getValues().title;
    var value2 = $$('form').getValues().year;
    var value3 = $$("form").getValues().votes;
    var value4 = $$("form").getValues().rating;
 
    var item = $$("table").getItem(sel);
    item.title = value1;
    item.year = value2;
    item.votes = value3;
    item.rating = value4;
    item = toDatatableView(item);
    $$("table").updateItem(sel, item);
    webix.message("Successful updating");
}


 
