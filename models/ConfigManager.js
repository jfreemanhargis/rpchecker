const Fs = require("fs");

class ConfigManager {
  constructor(bot, config) {
    this.path = "../config/" + this.config + ".json";
    this.bot = bot;
    this.config = config;
    this.dirty = false;
    this.items = [];

    try {
      console.log(" - Loading Config: " + this.config);
      this.items = require("../config/" + this.config + ".json");
    } catch (e) {
      console.log("   - Config not found. Creating: " + this.config);
      this.saveConfig();
    }

    setInterval(() => {
      if (this.dirty) {
        this.dirty = false;
        this.saveConfig();
      }
    }, 30000);
  }

  getItems(sortField = false) {
    if (sortField) return this.sortBy(sortField);
    return this.items;
  }

  length() {
    return this.items.length;
  }

  listItems(includeID = false) {
    var ret = "Items in " + this.config + " database:\n";
    this.getItems().forEach(itemObj => {
      var item = itemObj.name;
      item = item.charAt(0).toUpperCase() + item.substr(1).toLowerCase();
      ret += "  - " + item;
      if (includeID) ret += " (" + itemObj.id + ")";
      ret += "\n";
    });
    return ret;
  }

  getItem(name, allowPartial = false) 
  {
    for (var i = 0; i < this.items.length; i++) 
    {
      if (this.items[i].name.toLowerCase() == name.toLowerCase())
        return this.attachFunction(this.items[i]);

      if (
        allowPartial &&
        (this.items[i].name.toLowerCase().includes(name.toLowerCase()) ||
          name.toLowerCase().includes(this.items[i].name.toLowerCase()))
      )
        return this.items[i];
    }
    return null;
  }

  getItemField(field, value, allowPartial = false) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i][field].toLowerCase() == value.toLowerCase())
        return this.items[i];

      if (
        allowPartial &&
        (this.items[i][field].toLowerCase().includes(value.toLowerCase()) ||
          value.toLowerCase().includes(this.items[i][field].toLowerCase()))
      )
        return this.items[i];
    }
    return null;
  }

  getItemField(field, value, allowPartial = false) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i][field].toLowerCase() == value.toLowerCase())
        return this.items[i];

      if (
        allowPartial &&
        (this.items[i][field].toLowerCase().includes(value.toLowerCase()) ||
          value.toLowerCase().includes(this.items[i][field].toLowerCase()))
      )
        return this.items[i];
    }
    return null;
  }

  getIndex(index) {
    if (this.items.length > index) {
      return this.items[index];
    }
    return null;
  }

  attachFunction(data) {
    // data.manager = this;
    // data.update = function() {
    //   console.log("Updating " + data.name);
    //   var manager = data.manager;
    //   delete data.update;
    //   delete data.manager;
    //   manager.setItem(data.name, data);
    // };
    return data;
  }

  setItem(name, details, sortBy = false) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].name == name) {
        this.items[i] = details;
        this.dirty = true;
        return true;
      }
    }

    this.items.push(details);
    if (sortBy) this.sortBy(sortBy);
    this.dirty = true;

    return false;
  }

  sortBy(sortField, dirty = false) {
    this.dirty = dirty ? dirty : this.dirty;
    return this.items.sort(function(a, b) {
      a = ("" + a[sortField]).toLowerCase();
      b = ("" + b[sortField]).toLowerCase();

      if (a > b) return 1;
      else if (a < b) return -1;
      return 0;
    });
  }

  removeItemField(field, value) {
    var itemFound = false;
    var newItems = [];

    for (var i = 0; i < this.items.length; i++) {
      console.log(this.items[i][field] + " | " + value);

      if (this.items[i][field] != value) {
        newItems.push(this.items[i]);
      } else {
        itemFound = true;
      }
    }

    this.items = newItems;
    this.dirty = true;

    return itemFound;
  }

  removeItem(name) {
    this.removeItemField("name", name);
  }

  removeIndex(index) {
    if (this.items.length > index) {
      this.items.splice(index, 1);
      this.dirty = true;
      return true;
    }
    return false;
  }

  clearItems() {
    this.items = [];
  }

  setItems(contents)
  {
    this.items = contents;
  }
  
  saveItems()
  {
    this.save();
  }

  saveConfig()
  {
    this.save();
  }

  save() 
  {
    Fs.writeFile(
      "./config/" + this.config + ".json",
      JSON.stringify(this.items, null, 4),
      "utf8",
      error => 
      {
        if (error) 
        {
          console.log("Error saving " + this.config + " items: " + error);
          return;
        }

        console.log("Saved " + this.config + " items.");
      }
    );
  }
}

module.exports = ConfigManager;
