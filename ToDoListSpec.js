describe("Check if 'To Do List' App meets certain conditions", function() {
    var toToListApp = new ToDoList();    
    
    it("should have 5 tasks pre-defined", function() {
        expect(toToListApp.taskList.length).toEqual(5);
    });
    
    it("check if for all 5 task completed value  is false", function() {
        expect(toToListApp.taskList[0].taskComplete).toBe(false);
        expect(toToListApp.taskList[1].taskComplete).toBe(false);
        expect(toToListApp.taskList[2].taskComplete).toBe(false);
        expect(toToListApp.taskList[3].taskComplete).toBe(false);
        expect(toToListApp.taskList[4].taskComplete).toBe(false);
    });
    
    it("Task list should not have more than 10 tasks", function() {
        expect(toToListApp.taskList.length).toBeLessThan(10);
    });
    
    it("Add new task and check list length is less than 10", function() {
        var taskItem = new TaskItem("Add new Task ", false);
        toToListApp.taskList.push(taskItem);
        
        expect(toToListApp.taskList.length).toEqual(6);
        expect(toToListApp.taskList.length).toBeLessThan(10);
    });
    
    it("Each task description should not have more that 120 characters", function() {
        toToListApp.taskList.forEach(function(task){
            //using 6 just to fail the spec
            expect(task.taskName.length).toBeLessThan(121);
        });        
    });
    
    it("verify delete operation", function() {
        
        //first verify current task list length is 6
        expect(toToListApp.taskList.length).toEqual(6);
        
        //now add one more task to list
        var taskItem = new TaskItem("Add new Task 2", false);
        toToListApp.taskList.push(taskItem);
        
        //now task list length should be 7
        expect(toToListApp.taskList.length).toEqual(7);
        
        //now delete the newly added task
        toToListApp.deleteATask("Add new Task 2");
        
        //if above delete operation works fine, task list length should again be 6
        expect(toToListApp.taskList.length).toEqual(6);
    });
    
    it("verify undo action - ADD", function() {
        
        //first verify current task list length is 6
        expect(toToListApp.taskList.length).toEqual(6);
        
        //now add one more task to list
        toToListApp.addNewTask("Undo Task 1");
        
        var taskItem = toToListApp.taskList[0];
        
        //now task list length should be 7
        expect(toToListApp.taskList.length).toEqual(7);
        
        expect(toToListApp.taskList).toContain(taskItem);
        
        //now undo the last action i.e. add new task
        toToListApp.performUndoAction();
        
        //now above created task should not be available in the list
        expect(toToListApp.taskList).not.toContain(taskItem);
    });
    
    it("verify undo action - Remove", function() {
        
        //first verify current task list length is 6
        expect(toToListApp.taskList.length).toEqual(6);
        
        //now add one more task to list
        toToListApp.addNewTask("Remove Task operation");
        
        var taskItem = toToListApp.taskList[0];
                
        expect(toToListApp.taskList).toContain(taskItem);
        
        //now delete the newly added task
        toToListApp.deleteATask("Remove Task operation");
        
        //now above created task should not be available in the list
        expect(toToListApp.taskList).not.toContain(taskItem);
        
        //now undo the last action i.e. delete new task
        toToListApp.performUndoAction();
        
        expect(toToListApp.taskList).toContain(jasmine.objectContaining({
          taskName: "Remove Task operation"
        }));
    });    
    
});