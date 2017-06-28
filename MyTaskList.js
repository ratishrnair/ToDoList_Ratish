var TaskItem = function(name, taskComplete, taskCreatedTime) {
    this.taskName = name;
    this.taskComplete = taskComplete;
    this.taskCreatedTime = taskCreatedTime || new Date().toDateString();
}

var ActionPerformed = function(operationName, appState) {
    this.operationName = operationName;
    this.appState = appState;    
}

var ToDoList = function() {
    
  this.resetLS();
  this.taskList = this.getValueInLS() || [];
    
  this.listOfActionsPerformed = [];

  if(!this.taskList.length) {
      this.taskList.push(new TaskItem("Get up at 6 ", false, '2017-06-27'));
      this.taskList.push(new TaskItem("Go for run", false));
      this.taskList.push(new TaskItem("Have cofee and read newspaper", false));
      this.taskList.push(new TaskItem("Leave for office by 8", false));
      this.taskList.push(new TaskItem("Setup a meeting with client at 11 AM", false));
  }
  
}

ToDoList.prototype.init = function() {
    this.myUl = document.getElementById('myUL');
      this.myInput = document.getElementById('myInput');
      this.selectAllButton = document.getElementById('selectAllCheckBox');
      this.deleteSelectedButton = document.getElementById('deleteSelectedItems');
      this.undoAction = document.getElementById('undoAction');
      this.sortByDate = document.getElementById('sortByDate');
      this.resetButton = document.getElementById('resetData');      

      if(this.resetButton) {
          this.resetButton.onclick = function() {
            this.resetLS();
            this.taskList = [];
            this.listOfActionsPerformed = [];
            this.updateView();  
          }.bind(this);
      } 
      
    this.addTaskToList();
    this.addDeleteOpToListItem();    
    this.addByInput(); 
    this.registerDeleteHandler();
    this.registerSelectAllHandler();
    this.registerDeleteSelectedHandler();
    this.registerUndoActionHandler();
    this.registerSortByDateHandler();
}

ToDoList.prototype.addTaskToList = function() {
    this.taskList.forEach(function(task) {
        var newLi = document.createElement('li');
        var text = document.createTextNode(task.taskName);
        
        var span = document.createElement("span");
        span.className = "checkBoxSpan";
        
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";        
        checkbox.id = "id_" + task.taskName;
        checkbox.checked = task.taskComplete;
        checkbox.onclick = function(evt) {
            var element = evt.target;            
            
            if(element.checked) {
                element.parentNode.parentNode.classList.add('checked');
            }else {
                element.parentNode.parentNode.classList.remove('checked');
            }
            
            this.taskList.forEach(function(item) {
                if("id_" + item.taskName === element.id) {
                    item.taskComplete = element.checked;   
                }
            }); 
            
            this.setValueInLS();
            
        }.bind(this);
        
        span.appendChild(checkbox);        
        
        newLi.appendChild(span);
        
        newLi.appendChild(text);
        if(task.taskComplete) {
            newLi.classList.add('checked'); 
        }else {
            newLi.classList.remove('checked'); 
        }
         
        this.myUl.appendChild(newLi);        
    }, this);
}

ToDoList.prototype.addDeleteOpToListItem = function() {
    // Add "delete" button and append it to each list item
    var myNodelist = document.getElementsByTagName("li");
    var i;
    for (i = 0; i < myNodelist.length; i++) {        
      var span = document.createElement("span");
      var txt = document.createTextNode("Delete");
      span.className = "delete";
      span.appendChild(txt);        
      
      myNodelist[i].appendChild(span);
    }
}

ToDoList.prototype.updateView = function() {
    this.removeAllItems();
    this.addTaskToList();
    this.addDeleteOpToListItem();    
    this.registerDeleteHandler();    
    this.setValueInLS();    
}

ToDoList.prototype.removeAllItems = function() {
    if (this.myUl.hasChildNodes()) {
        var i, childNodeLen = this.myUl.childNodes.length;
        for (i = 0; i < childNodeLen; i++) {
            this.myUl.removeChild(this.myUl.childNodes[0]);
        }
    }
}

ToDoList.prototype.registerDeleteHandler = function() {
    // Click on a delete link to remove the item from the list
    var deleteItems = document.getElementsByClassName("delete");
    var i;
    for (i = 0; i < deleteItems.length; i++) {
      deleteItems[i].onclick = function(evt) {
        var listItem = evt.target.parentElement;
        var taskName = listItem.childNodes[1].textContent;
          
        this.deleteATask(taskName);
        
        this.updateView();
          
      }.bind(this);
    }
}

ToDoList.prototype.addByInput = function() {
  this.myInput.addEventListener('keyup', function(e) {
    e.preventDefault();
    var itemText = e.target.value;
    if(e.keyCode === 13 && (itemText.length > 0 && itemText.length < 121) && this.taskList.length < 10 &&               !this.checkIfTaskExist(itemText)) {
        
      this.addNewTask(itemText);
      e.target.value = null;
      this.updateView();
    }
  }.bind(this));
}

ToDoList.prototype.addNewTask = function(taskText) {
    var appStateClone = JSON.parse(JSON.stringify(this.taskList));
    var action = new ActionPerformed("addSingleTask", appStateClone);      
    this.listOfActionsPerformed.push(action);
    
    this.taskList.unshift(new TaskItem(taskText, false));
}

ToDoList.prototype.checkIfTaskExist = function(val) {
    var exist = this.taskList.find(function(item) {
        return item.taskName === val;                       
    });
    return exist;
}

ToDoList.prototype.registerSelectAllHandler = function(val) {
    this.selectAllButton.addEventListener('click', function(e) {
        if (this.selectAllButton.value === "Select All") {
            this.selectAllButton.value = "De-select All";
        }else {
            this.selectAllButton.value = "Select All";
        } 
        
        var appStateClone = JSON.parse(JSON.stringify(this.taskList));
        var action = new ActionPerformed("selectAllTasks", appStateClone);
        this.listOfActionsPerformed.push(action);
        
        var inputs = document.querySelectorAll("input[type='checkbox']");
        for(var i = 0; i < inputs.length; i++) {
            inputs[i].click();
        }        
    }.bind(this));
}

ToDoList.prototype.registerDeleteSelectedHandler = function(val) {
    this.deleteSelectedButton.addEventListener('click', function(e) {
        var inputs = document.querySelectorAll("input[type='checkbox']");
        var listOfSelectedTasks = [];
        for(var i = 0; i < inputs.length; i++) {
            if(inputs[i].checked) {
                var selectedId = inputs[i].id;
                selectedId = selectedId.split("_")[1];                
                listOfSelectedTasks.push(selectedId);                                                
            }            
        }
        this.deleteMultipleTasks(listOfSelectedTasks);
        this.updateView();
    }.bind(this), false);
}

ToDoList.prototype.deleteMultipleTasks = function(listOfSelectedTasks) {
    if(listOfSelectedTasks.length) {
        
        var appStateClone = JSON.parse(JSON.stringify(this.taskList));
        var action = new ActionPerformed("deleteMultipleTask", appStateClone);
        this.listOfActionsPerformed.push(action);

        var newTaskList = this.taskList.filter(function(item) {
            return listOfSelectedTasks.indexOf(item.taskName) == -1;
        });

        this.taskList = newTaskList;
    }    
}

ToDoList.prototype.deleteATask = function(taskName) {
    
    var appStateClone = JSON.parse(JSON.stringify(this.taskList));
    var action = new ActionPerformed("removeSingleTask", appStateClone);
    this.listOfActionsPerformed.push(action);
    
    var newTaskList = this.taskList.filter(function(item) {
        return item.taskName !== taskName;
    });

    this.taskList = newTaskList;
}

ToDoList.prototype.registerUndoActionHandler = function(val) {
    this.undoAction.addEventListener('click', function(e) {
        this.performUndoAction();
        this.updateView();        
    }.bind(this));    
}

ToDoList.prototype.performUndoAction = function() {
    if(this.listOfActionsPerformed.length) {
        var lastPerformedOp = this.listOfActionsPerformed.pop();
        var lastAppState = lastPerformedOp.appState;
        this.taskList = lastAppState;            
    }   
}

ToDoList.prototype.registerSortByDateHandler = function(val) {
    this.sortByDate.addEventListener('click', function(e) {
        
        this.taskList.sort(function(o1, o2) {
            return new Date(o1.taskCreatedTime) - new Date(o2.taskCreatedTime);
        });        
        
        this.updateView();        
    }.bind(this));    
}

ToDoList.prototype.setValueInLS = function() {
    localStorage.setItem("taskList", JSON.stringify(this.taskList));
}

ToDoList.prototype.getValueInLS = function() {
    var data = localStorage.getItem("taskList");
    if(data) {
        return JSON.parse(data);        
    } else {
        return null;
    }
}

ToDoList.prototype.resetLS = function() {
    localStorage.removeItem("taskList");
}