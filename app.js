
        const taskInput = document.getElementById('taskInput');
        const addTaskBtn = document.getElementById('addTask');
        const taskList = document.getElementById('taskList');
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');

        let tasks = [];

        // Add these functions at the beginning of your script
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }

        function loadTasks() {
            const savedTasks = localStorage.getItem('tasks');
            if (savedTasks) {
                tasks = JSON.parse(savedTasks);
                tasks.forEach(task => {
                    taskList.appendChild(createTaskElement(task));
                });
                updateProgress();
            }
        }

        function updateProgress() {
            const completedTasks = tasks.filter(task => task.completed).length;
            const totalTasks = tasks.length;
            const percentage = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

            progressBar.style.width = `${percentage}%`;
            progressText.textContent = `${completedTasks} / ${totalTasks}`;
            saveTasks(); // Save tasks after updating progress
        }

        function createTaskElement(task) {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <input type="text" class="task-text" value="${task.text}" readonly>
                <div class="task-actions">
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </div>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            const taskTextInput = li.querySelector('.task-text');
            const editBtn = li.querySelector('.edit');
            const deleteBtn = li.querySelector('.delete');

            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                updateProgress();
                saveTasks(); // Save tasks after changing completion status
            });

            editBtn.addEventListener('click', () => {
                if (taskTextInput.readOnly) {
                    taskTextInput.readOnly = false;
                    taskTextInput.focus();
                    editBtn.textContent = 'Save';
                } else {
                    taskTextInput.readOnly = true;
                    task.text = taskTextInput.value;
                    editBtn.textContent = 'Edit';
                    saveTasks(); // Save tasks after editing
                }
            });

            taskTextInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    taskTextInput.readOnly = true;
                    task.text = taskTextInput.value;
                    editBtn.textContent = 'Edit';
                    saveTasks(); // Save tasks when pressing Enter
                }
            });

            deleteBtn.addEventListener('click', () => {
                tasks = tasks.filter(t => t !== task);
                taskList.removeChild(li); // Directly remove the task from the list
                updateProgress();
                saveTasks(); // Save tasks after deleting
            });

            return li;
        }

        function addTask() {
            const text = taskInput.value.trim();
            if (text) {
                const task = { text, completed: false };
                tasks.push(task);
                taskList.appendChild(createTaskElement(task));
                taskInput.value = '';
                updateProgress();
                saveTasks(); // Save tasks after adding a new task
            }
        }

        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });

        // Load tasks when the page loads
        window.addEventListener('DOMContentLoaded', loadTasks);

   