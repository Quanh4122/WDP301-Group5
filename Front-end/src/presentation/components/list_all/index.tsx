import React, { useEffect } from "react";
import axios from "axios";
import { Table, TableColumnsType } from "antd";
import TableData from "./components/TableData";
import { columnsStudent } from "./CONSTANTS";
import { url } from "inspector";
import banner from "../../images/banner.jpg"
import ProductDisplay from "./components/ProductDisplay";

const ListAll = () => {

    const [studentList, setStudentList] = React.useState<any>()
    const [courseList, setCourseList] = React.useState()
    const [enrollmentsList, setEnrollmentsList] = React.useState()

    const [relStudentList, setRelStudentList] = React.useState<any>()

    useEffect(() => {
        // axios.get("http://localhost:3030/students")
        //     .then(res => setStudentList(res.data))
        //     .catch(err => console.log(err))

        // axios.get("http://localhost:3030/courses")
        //     .then(res => setCourseList(res.data))
        //     .catch(err => console.log(err))

        // axios.get("http://localhost:3030/enrollments")
        //     .then(res => setEnrollmentsList(res.data))
        //     .catch(err => console.log(err))

        setRelStudentList(fillEnrollmentToStudentList(studentList, enrollmentsList, courseList))
    }, [])

    const getInfiEnrollment = (studentId: number, enrollList?: any[], courseList?: any[]) => {
        if (enrollList && courseList) {
            const findList = enrollList.filter((item: any) => item.studentId == studentId)
            const rel = findList.map((item: any) => {
                return getCourseById(item.courseId, courseList)
            })
            return rel
        }
    }

    const getCourseById = (courseId: number, courseList?: any[]) => {
        const rel = courseList?.find((item) => {
            if (item.id === courseId)
                return item
        })
        return rel
    }

    const fillEnrollmentToStudentList = (studentList?: any[], enrollment?: any[], courseList?: any[]) => {
        if (studentList && enrollment && courseList) {
            const rel = studentList.map((item: any) => {
                return {
                    ...item,
                    enrollment: getInfiEnrollment(item.id, enrollment, courseList)
                }
            })
            return rel
        }
    }

    const onDelete = (record: any) => {
        const data = studentList?.map((item: any) => {
            return {
                id: item.id,
                name: item.name,
                email: item.email
            }
        })

        const relListData = data?.filter((item: any) => item.id != record.id)

        console.log(relListData)
        axios.put("http://localhost:3030/students", relListData)
            .then(res => console.log(res.data))
            .catch(err => console.log(err))

        axios.get("http://localhost:3030/students")
            .then(res => setStudentList(res.data))
            .catch(err => console.log(err))

    }

    return (
        <div className="">
            <div className="w-2/3 h-auto text-white "
                style={{
                    backgroundImage: `url(${banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '800px',
                    width: '100%',
                }}
            >
            </div>
            <div>
                <ProductDisplay />
            </div>

        </div>
    )
}

export default ListAll