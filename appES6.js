class Course {
  constructor(code, title, instructor, classroom, date, image) {
    this.courseId = Math.floor(Math.random() * 10000);
    this.code = code;
    this.title = title;
    this.instructor = instructor;
    this.classroom = classroom;
    this.date = date;
    this.image = image;
  }
}

class UI {
  addCourseToList(course) {
    const list = document.getElementById("course-list");
    var html = `
              <tr>
                   <td><img src="img/${course.image}"/></td>
                   <td>${course.code}</td>
                   <td>${course.title}</td>
                   <td>${course.instructor}</td>
                   <td>${course.classroom}</td>
                   <td>${course.date}</td>
                   <td><a href="#" data-id="${course.courseId}"
                   class="btn btn-danger btn-sm delete">Delete</a></td>
              </tr>
    
    
    `;
    list.innerHTML += html;
  }
  clearControls() {
    const code = (document.getElementById("code").value = "");
    const title = (document.getElementById("title").value = "");
    const instructor = (document.getElementById("instructor").value = "");
    const classroom = (document.getElementById("classroom").value = "");
    const date = (document.getElementById("date").value = "");
    const image = (document.getElementById("image").value = "");
  }

  deleteCourse(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
      return true;
    }
  }
  showAlert(message, className) {
    var alert = `
      <div class="alert alert-${className}">
            ${message}
      </div> 
      `;

    const row = document.querySelector(".row");
    //beforeBegin, afterBegin, beforeEnd, afterEnd
    row.insertAdjacentHTML("beforeBegin", alert);

    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 2000);
  }
}

class Storage {
  static getCourses() {
    let courses;
    if (localStorage.getItem("courses") === null) {
      courses = [];
    } else {
      courses = JSON.parse(localStorage.getItem("courses"));
    }

    return courses;
  }

  static displayCourses() {
    const courses = Storage.getCourses();

    courses.forEach((course) => {
      const ui = new UI();
      ui.addCourseToList(course);
    });
  }
  static addCourse(course) {
    const courses = Storage.getCourses();
    courses.push(course);
    localStorage.setItem("courses", JSON.stringify(courses));
  }

  static deleteCourse(element) {
    if (element.classList.contains("delete")) {
      const id = element.getAttribute("data-id");
      const courses = Storage.getCourses();
      courses.forEach((course, index) => {
        if (course.courseId == id) {
          courses.splice(index, 1);
        }
      });

      localStorage.setItem("courses", JSON.stringify(courses));
    }
  }
}

document.addEventListener("DOMContentLoaded", Storage.displayCourses);

document.getElementById("new-course").addEventListener("submit", function (e) {
  const code = document.getElementById("code").value;
  const title = document.getElementById("title").value;
  const instructor = document.getElementById("instructor").value;
  const classroom = document.getElementById("classroom").value;
  const date = document.getElementById("date").value;
  const image = document.getElementById("image").value;

  //create Course object
  const course = new Course(code, title, instructor, classroom, date, image);

  console.log(course);

  //create UI
  const ui = new UI();

  if (
    code === "" ||
    title === "" ||
    instructor === "" ||
    classroom === "" ||
    date === "" ||
    image === ""
  ) {
    ui.showAlert("Please complete the form", "warning");
  } else {
    //add course to list
    ui.addCourseToList(course);

    //save to Local Storage
    Storage.addCourse(course);

    //clear controls
    ui.clearControls();

    ui.showAlert("The course has been added.", "success");
  }

  e.preventDefault(); //submit olayını kesicem refresh'i engellemek için
});

document.getElementById("course-list").addEventListener("click", function (e) {
  const ui = new UI();
  //delete course
  if (ui.deleteCourse(e.target) == true) {
    //delete from Local Storage

    Storage.deleteCourse(e.target);

    ui.showAlert("The course has been deleted.", "danger");
  }
});
