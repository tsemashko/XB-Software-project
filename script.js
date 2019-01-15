var categories = new webix.DataCollection({
  url:"data/categories.js"
});

var users = new webix.DataCollection({
  url:"data/users.js"
});

var segmentedFilter = {
  view: "segmented",
  id: "selector",
  options: [
    { id: 1, value: "All" },
    { id: 2, value: "Old" },
    { id: 3, value: "Modern" },
    { id: 4, value: "New" }
  ],
  on: {
    onChange: function() {
      $$("table").filterByAll();
    }
  }
};

var table = {
  view: "datatable",
  id: "table",
  scrollX: false,
  select: true,
  hover: "table-hover",
  editable: true,
  editaction: "dblclick",
  onClick: {
    remove(e, id) {
      this.remove(id);
      return false;
    }
  },
  rules: {
    title: value => {
      return clearTags(webix.rules.isNotEmpty(value));
    },
    year: value => {
      return clearTags(value) > 1970 && clearTags(value) < 2019;
    },
    votes: value => {
      return clearTags(value) < 100000 && clearTags(value).trim() !== "";
    },
    rating: value => {
      return (
        clearTags(value) !== "0" &&
        clearTags(value).trim() !== "" &&
        webix.rules.isNumber(value)
      );
    }
  },
  columns: [
    {
      id: "id",
      header: "",
      width: 50,
      sort: "int",
      css: { "background-color": "#F4F5F9" },
      editor: "text"
    },
    {
      id: "title",
      header: ["Title", { content: "textFilter" }],
      fillspace: 1,
      sort: "string",
      editor: "text"
    },
    {
      id: "categoryId",
      header: ["Category", { content: "selectFilter" }],
      editor: "select",
      collection: categories
    },
    {
      id: "votes",
      sort: "int",
      header: ["Votes", { content: "textFilter" }],
      editor: "text"
    },
    {
      id: "rating",
      header: ["Rating", { content: "textFilter" }],
      sort: "int",
      editor: "text"
    },
    {
      id: "year",
      header: "Released",
      sort: "int",
      editor: "text"
    },
    { template: "<i class='webix_icon wxi-trash remove'></i>", width: 50 }
  ],
  url: "data/data.js",
  scheme: {
    $init: function(obj) {
      obj = toRightView(obj);
      obj["categoryId"] = Math.floor(Math.random() * 4) + 1;
    }
  }
};

var header = {
  view: "toolbar",
  css: "webix_dark",
  cols: [
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
  rows: [
    {
      view: "list",
      id: "mylist",
      scroll: false,
      width: 200,
      data: ["Dashboard", "Users", "Products", "Admin"],
      gravity: 0.45,
      select: true,
      on: {
        onAfterSelect: function(id) {
          $$(id).show();
        }
      }
    },
    {
      template:
        "<i class='webix_icon wxi-check' style='color: green'></i> <span  style='color: green'>Connected</span>",
      gravity: 0.55,
      css: "center-align menu",
      autoheight: true
    }
  ]
};

var form = {
  view: "form",
  id: "form",
  scroll: false,
  width: 300,
  rules: {
    title: value => {
      return clearTags(webix.rules.isNotEmpty(value));
    },
    year: value => {
      return clearTags(value) > 1970 && clearTags(value) < 2019;
    },
    votes: value => {
      return clearTags(value) < 100000 && clearTags(value).trim() !== "";
    },
    rating: value => {
      return (
        clearTags(value) !== "0" &&
        clearTags(value).trim() !== "" &&
        webix.rules.isNumber(value)
      );
    }
  },
  elements: [
    { view: "template", template: "Edit films", type: "section" },
    {
      view: "text",
      name: "title",
      label: "Title",
      invalidMessage: "The title must be filled in"
    },
    {
      view: "text",
      name: "year",
      label: "Year",
      invalidMessage: "The year must be 1970-2019"
    },
    {
      view: "text",
      name: "votes",
      label: "Votes",
      invalidMessage: "The votes must be < 100000"
    },
    {
      view: "text",
      name: "rating",
      label: "Rating",
      invalidMessage: "The rating can't be empty or 0"
    },
    {
      view: "richselect",
      name: "categoryId",
      label: "Category",
      options: categories
    },
    {
      margin: 5,
      cols: [
        { view: "button", value: "Save", type: "form", click: saveFilm },
        { view: "button", label: "Clear", click: clearForm }
      ]
    },
    {}
  ]
};

webix.protoUI(
  {
    name: "editlist"
  },
  webix.EditAbility,
  webix.ui.list
);

var usersList = {
  view: "editlist",
  id: "userslist",
  editable: true,
  editaction: "dblclick",
  editor: "text",
  editValue: "name",
  template:
    "#name# from #country# <i class='webix_icon wxi-close removeUser'></i>",
  select: true,
  rules: {
    name: webix.rules.isNotEmpty
  },
  onClick: {
    removeUser(e, id) {
      users.remove(id);
    }
  },
  scheme: {
    $init: function(obj) {
      if (obj["age"] < 26) obj.$css = "younger-users";
    }
  }
};

var usersChart = {
  view: "chart",
  id: "userschart",
  type: "bar",
  value: "#country#",
  xAxis: {
    template: "#id#",
    title: "Country"
  },
  yAxis: {}
};

var usersFilter = {
  view: "toolbar",
  elements: [
    {
      view: "text",
      on: {
        onTimedKeyPress() {
          $$("userslist").filter(user => {
            return (
              user.name.toLowerCase().indexOf(this.getValue().toLowerCase()) !== -1
            );
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
        $$("userslist").data.sort("name", "asc");
      }
    },
    {
      view: "button",
      value: "Sort desc",
      width: 100,
      type: "form",
      click() {
        $$("userslist").data.sort("name", "desc");
      }
    },
    {
      view: "button",
      value: "Add new",
      width: 100,
      click() {
        var countries = ["USA", "Germany", "Canada", "Russia", "China"];
        //var newId = $$("userslist").getLastId() + 1;
        var newName = "Name Surname";
        var newAge = Math.floor(Math.random() * 42) + 18;
        var newCountry =
          countries[Math.floor(Math.random() * countries.length)];
        var newUser = {
          //id: newId,
          name: newName,
          age: newAge,
          country: newCountry
        };
        users.add(newUser);
      }
    }
  ]
};

var treeTable = {
  view: "treetable",
  id: "treetable",
  scrollX: false,
  editable: true,
  editaction: "dblclick",
  rules: {
    title: webix.rules.isNotEmpty
  },
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
      fillspace: true,
      editor: "text"
    },
    {
      id: "price",
      header: "Price",
      width: 200,
      editor: "text"
    }
  ],
  ready: function() {
    this.openAll();
  },
  select: true
};

var tableForCategories = {
  view: "datatable",
  id: "categorytable",
  columns:[
    {
      id: "id",
      header: "",
      width: 50
    },
    {
      id: "value",
      header: "Category",
      fillspace: true,
      editor: "text"
    }
  ],
  select: true,
  editable: true,
  editaction: "dblclick",
  //save: "rest->data/categories_save.js"
};

var formForCategories = {
  view: "form",
  id: "categoryform",
  scroll: false,
  width: 300,
  rules: {
    value: value => {
      return clearTags(webix.rules.isNotEmpty(value));
    }
  },
  elements:[
    {
      view: "text",
      name: "value",
      label: "Category",
      invalidMessage: "Can't be empty"
    },
    {
      margin: 5,
      cols: [
        { view: "button", value: "Save", type: "form", click: saveCategory },
        { view: "button", value: "Delete", click: function(){
          var item = $$("categorytable").getSelectedId();
           $$("categorytable").remove(item);
        } }
      ]
    },
  ]
}

webix.ui({
  rows: [
    header,
    {
      cols: [
        left_side,
        { view: "resizer" },
        {
          cells: [
            {
              id: "Dashboard",
              cols: [{ rows: [segmentedFilter, table] }, form]
            },
            { id: "Users", rows: [usersFilter, usersList, usersChart] },
            { id: "Products", rows: [treeTable] },
            { id: "Admin", rows: [formForCategories, tableForCategories] }
          ]
        }
      ]
    },
    {
      view: "template",
      template:
        "The software is provided by <a href='https://webix.com'>https://webix.com</a>. All rights reserved (c).",
      css: { "text-align": "center" },
      autoheight: 1
    }
  ]
});

var popup = webix.ui({
  view: "popup",
  id: "popup",
  width: 300,
  body: {
    view: "list",
    data: ["Settings", "Log Out"],
    scroll: false,
    select: true,
    autoheight: true
  }
});

//$$("userslist").load("data/users.js");
$$("treetable").load("data/products.js");



$$("form").bind($$("table"));
$$("categoryform").bind(categories);

$$("categorytable").sync(categories);

$$("mylist").select("Dashboard");

$$("table").registerFilter(
  $$("selector"),
  {
    columnId: "year",
    compare: function(value, filter, item) {
      var year = value;
      if (filter == 2) return year < 2000;
      if (filter == 3) return year >= 2000 && year < 2015;
      if (filter == 4) return year >= 2015;
      else return true;
    }
  },
  {
    getValue: function(node) {
      return node.getValue();
    },
    setValue: function(node, value) {
      node.setValue(value);
    }
  }
);


$$("userslist").sync(users);
$$("userschart").sync(users, function() {
  this.group({
    by: "country",
    map: {
      country: ["country", "count"]
    }
  });
});


function toRightView(data) {
  data.votes = convertVotesToNumber(data.votes);
  data.rating = data.rating.replace(",", ".");
  return data;
}

function convertVotesToNumber(data) {
  const len = data.length - data.indexOf(",") - 1;
  for (var i = 0; i < 3 - len; i++) {
    data += "0";
  }
  data = data.replace(",", "");
  return data;
}

function clearForm() {
  webix.confirm({
    title: "Clearing form",
    text: "Are you sure you want to clear form?",
    callback(result) {
      if (result) {
        $$("form").clear();
        $$("form").clearValidation();
        $$("table").unselectAll();
      }
    }
  });
}

function clearTags(value) {
  var regexp = new RegExp("<[^>]+>([^<>]*)</[^><]+>");
  if (value.search(regexp) !== -1) value = value.replace(regexp, "$1");
  return value;
}

function saveFilm() {
  save("table", "form");
}

function saveCategory(){
  save("table", "categoryform", categories);
}

function save(table, form, collection){
  if ($$(form).validate()) {
    var values = $$(form).getValues();
    for (var key in values) {
      if (key !== "id") values[key] = clearTags(values[key]);
    }

    $$(form).setValues(values);
    $$(form).save();
    $$(form).clear();
    $$(table).unselectAll();
    webix.message("Successful table updating");
  }
}
