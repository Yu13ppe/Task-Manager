document.addEventListener("DOMContentLoaded", function () {
  var activitiesContainer = document.getElementById("activities-container");
  var activitiesList = document.getElementById("activities-list");

  var storedActivities = JSON.parse(localStorage.getItem("activities")) || [];
  if (storedActivities.length === 0) {
    loadActivities();
  } else {
    displayActivities(storedActivities);
  }

  var activityForm = document.getElementById("activity-form");
  activityForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Evitar el envío del formulario

    var titleInput = document.getElementById("title");
    var descriptionInput = document.getElementById("description");
    var startDateInput = document.getElementById("start-date"); // Nuevo
    var endDateInput = document.getElementById("end-date"); // Nuevo
    var responsibleInput = document.getElementById("responsible"); // Nuevo

    var title = titleInput.value;
    var description = descriptionInput.value;
    var startDate = startDateInput.value; // Nuevo
    var endDate = endDateInput.value; // Nuevo
    var responsible = responsibleInput.value; // Nuevo

    addActivity(title, description, startDate, endDate, responsible); // Actualizado

    titleInput.value = "";
    descriptionInput.value = "";
    startDateInput.value = ""; // Nuevo
    endDateInput.value = ""; // Nuevo
    responsibleInput.value = ""; // Nuevo
  });

  function updateLocalStorage(activities) {
    localStorage.setItem("activities", JSON.stringify(activities));
  }

  // AJAX
  function loadActivities() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "api/actividades.json", true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        var activities = JSON.parse(xhr.responseText);
        displayActivities(activities);
        updateLocalStorage(activities); // Almacenar actividades en el almacenamiento local
      }
    };
    xhr.send();
  }

  function displayActivities(activities) {
    activitiesList.innerHTML = "";

    activities.forEach(function (activity) {
      var listItem = document.createElement("li");
      listItem.innerHTML =
        "<strong>" +
        activity.titulo +
        ":</strong> " +
        activity.descripcion +
        " <br> " +
        " Fecha de inicio: " +
        activity.fechaInicio +
        " <br> " +
        "Fecha final: " +
        activity.fechaFinal +
        " <br> " +
        "Responsable: " +
        activity.responsable;

      var buttonsDiv = document.createElement("div"); 

      var editButton = document.createElement("button-modify");
      editButton.innerText = "Modificar";
      editButton.addEventListener("click", function () {
        var newValues = prompt(
          "Ingrese los nuevos valores en el siguiente formato: Título, Descripción, Fecha de inicio, Fecha final, Responsable",
          activity.titulo +
            ", " +
            activity.descripcion +
            ", " +
            activity.fechaInicio +
            ", " +
            activity.fechaFinal +
            ", " +
            activity.responsable
        );

        if (newValues) {
          var parts = newValues.split(", ");
          if (parts.length === 5) {
            activity.titulo = parts[0];
            activity.descripcion = parts[1];
            activity.fechaInicio = parts[2];
            activity.fechaFinal = parts[3];
            activity.responsable = parts[4];
            displayActivities(activities);
            updateLocalStorage(activities);
          }
        }
      });
      buttonsDiv.appendChild(editButton);

      var deleteButton = document.createElement("button-delete");
      deleteButton.innerText = "Eliminar";
      deleteButton.addEventListener("click", function () {
        var confirmDelete = confirm(
          "¿Estás seguro de eliminar esta actividad?"
        );

        if (confirmDelete) {
          activities.splice(activities.indexOf(activity), 1);
          displayActivities(activities);
          updateLocalStorage(activities);
        }
      });
      buttonsDiv.appendChild(deleteButton);

      listItem.appendChild(buttonsDiv)
      activitiesList.appendChild(listItem);
    });
  }

  function addActivity(title, description, startDate, endDate, responsible) {
    // Actualizado
    var newActivity = {
      titulo: "📌" + title,
      descripcion: description,
      fechaInicio: startDate, // Nuevo
      fechaFinal: endDate, // Nuevo
      responsable: responsible, // Nuevo
    };

    var activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.push(newActivity);

    displayActivities(activities);
    updateLocalStorage(activities);
  }
});
