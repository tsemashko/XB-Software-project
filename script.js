var table = {
    view:"datatable",
    autoConfig:true,
    data: info,
    height:500,
    scrollX: false
};

var header = {
    cols:[
        {
            view:"template", 
            type:"header", 
            template:"My App",
            borderless: true,
            gravity: 0.85
        },
        {
            //не получилось сделать кнопкой, чтоб при этом всё выглядело так же
            view:"template", 
            type:"header", 
            id: "img",
            template:"html->user_image",
            borderless: true,
            gravity: 0.15
        }
    ]
};



var left_side = { 
    rows:[ 
    {
        view:"list",
        id:"mylist",
        scroll:false,
        autoheight:true,
        width:200,
        data:[ "Dashboard", "Users", "Products", "Locations" ],
        gravity:0.45
    },
    {
        template:"html->connected",
        gravity: 0.55,
        css: {"text-align":"center", "padding-top":"330px"},
    }
    ]
  };


var form = {
    view:"form", scroll:false,
    width:300,
    borderless: true,
    elements:[
        { view:"text", label:"Title"},
        { view:"text", label:"Year"},
        { view:"text", label:"Rating"},
        { view:"text", label:"Votes"},
        { margin:5, cols:[
            { view:"button", label:"Add new" , type:"form" },
            { view:"button", label:"Clear" }
        ]}
    ]
};

webix.ui({
      rows:[
        header,
        {
            cols:[left_side, {view:"resizer"}, table,
            {
                rows:[
                    {height:20},
                    {view: "template", template: "Edit films", type: "section"},
                    form
                ]
            }
        ]
        },
        {view:"template", template:"The software is provided by <a href='https://webix.com'>https://webix.com</a>. All rights reserved (c).",
        css: {"text-align":"center"}}  
      ]   
  });
