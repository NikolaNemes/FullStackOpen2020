import React from 'react';

const Header = ({ course }) => <h1>{course.name}</h1>

  
const Total = ({ course }) => {
    const sum = course.parts.map((part) => part.exercises).reduce((acc, val) => acc + val, 0);
    return(
      <p>Number of exercises {sum}</p>
    ) 
}
  
const Part = (props) => <p>{props.part.name} {props.part.exercises}</p>    

  
const Content = ({ course }) => {
    return (
        <div>
        {course.parts.map(part => 
            <Part part={part} key={part.id}/>
        )}
        </div>
    )
}
  
const Course = ({course}) => {
    return (
        <div>
            <Header course={course}/>
            <Content course={course}/>
            <Total course={course}/>
        </div>
    )
}

export default Course