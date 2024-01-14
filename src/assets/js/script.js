function generateId () {
	return Math.random().toString(16).slice(2, 9)
}

function getTasks () {
	const tasks = JSON.parse(window.localStorage.getItem('tasks')) || []
	return tasks
}

function checkAndDisplayEmptyMessage(taskList) {
	if (taskList.children.length === 0) {
			taskList.innerHTML = '<li class="fromLeft" style="text-align: center">Não há tarefas</li>';
	}
}

function addToDOM (taskObject) {
	const { completed, id, label, tab } = taskObject

	const dayTasks = document.querySelector('.day-tasks')
	const nightTasks = document.querySelector('.night-tasks')

	if (dayTasks.textContent === 'Não há tarefas') {
		dayTasks.textContent = ''
	}

	if (nightTasks.textContent === 'Não há tarefas') {
		nightTasks.textContent = ''
	}

	const task = Object.assign(
		document.createElement('li'),
		{
			className: 'task fromLeft',
			innerHTML: `
				<input
					${completed ? 'checked' : ''}
					id="${id}"
					onclick="toggleCompleteStatus(event)"
					type="checkbox"
				/>
				<label for="${id}" class="${completed ? 'completed' : ''}">${label}</label>
				<button class="btn-delete" onclick="deleteTask(event)">x</button>
			`
		}
	)

	if (tab === 'day') {
		dayTasks.appendChild(task)
	} else {
		nightTasks.appendChild(task)
	}

	checkAndDisplayEmptyMessage(dayTasks);
	checkAndDisplayEmptyMessage(nightTasks);
}

function addTask () {
	const inputTask = document.getElementById('new-task')
	const tabSelected = document.getElementById('task-tab').value

	if (!inputTask || !tabSelected || inputTask.value.trim() === '') return

	const newTask = {
		id: generateId(),
		label: inputTask.value,
		tab: tabSelected,
		completed: false
	}

	const tasks = getTasks()
	const tasksUpdated = [...tasks, newTask]

	window.localStorage.setItem('tasks', JSON.stringify(tasksUpdated))
	inputTask.value = ''

	addToDOM(newTask)
}

function toggleCompleteStatus({ target }) {
	const { id } = target
	const tasks = getTasks()

	const taskIndex = tasks.findIndex(task => task.id === id)

	if (taskIndex !== -1) {
			tasks[taskIndex].completed = !tasks[taskIndex].completed
			window.localStorage.setItem('tasks', JSON.stringify(tasks))
	} else {
			console.error('Task not found')
	}

	target.nextElementSibling.classList.toggle('completed')
}

function deleteTask({ target }) {
	const label = target.previousElementSibling
	const id    = label.htmlFor
	const tasks = getTasks()

	const updatedTasks = tasks.filter((task) => task.id !== id)

	window.localStorage.setItem("tasks", JSON.stringify(updatedTasks))

	target.parentNode.remove()

	const dayTasks = document.querySelector('.day-tasks')
	const nightTasks = document.querySelector('.night-tasks')

	checkAndDisplayEmptyMessage(dayTasks);
	checkAndDisplayEmptyMessage(nightTasks);
}

(function attachTasks() {
	const tasks = getTasks();
	
	const dayTasks = document.querySelector('.day-tasks')
	const nightTasks = document.querySelector('.night-tasks')
	
	if (tasks && tasks.length > 0) {
		tasks.forEach(task => addToDOM(task))
	} else {
		checkAndDisplayEmptyMessage(dayTasks);
		checkAndDisplayEmptyMessage(nightTasks);
	}
})()
