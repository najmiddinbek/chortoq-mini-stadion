"use client";

import React, { useState, useEffect } from "react";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";

const Filter = () => {
    const [topics, setTopiclar] = useState([]);
    const [filteredMavzula, setFilteredMavzula] = useState([]);
    const [filterValue, setFilterValue] = useState({
        date: "",
    });
    const [hide, setHide] = useState(false);

    const handleHide = () => {
        setHide(!hide);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/topics", {
                    cache: "no-store",
                });
                if (!res.ok) {
                    throw new Error("Mavzular yuklanmadi");
                }

                const data = await res.json();
                const topics = data?.topics;

                setTopiclar(topics);
                setFilteredMavzula(topics);
            } catch (error) {
                console.log("Mavzular yuklanishda xatolik: ", error);
            }
        };

        fetchData();
    }, []);




    const [usersAddedByDate, setUsersAddedByDate] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const usersGroupedByDate = filteredMavzula.reduce((acc, t) => {
                const dateKey = new Date(t.createdAt).toLocaleDateString();
                acc[dateKey] = acc[dateKey] || [];
                acc[dateKey].push(t);
                return acc;
            }, {});

            setUsersAddedByDate(usersGroupedByDate);
        };

        fetchData();
    }, [filteredMavzula]);

    const handleFilter = () => {
        const filteredArray = topics.filter(
            (t) =>
                t.date.toLowerCase().includes(filterValue.date.toLowerCase())
        );

        setFilteredMavzula(filteredArray);
    };



    const [filterStatus, setFilterStatus] = useState(null);

    const changeStatus = async (id) => {
        const confirmed = confirm("Stadion hozir bo`sh holatdami");

        if (confirmed) {
            const res = await fetch(`/api/topics?id=${id}`, {
                method: "PUT",
            });

            if (res.ok) {
            }
        }
    };

    return (
        <div>
            <div className="container">
                <div className="">
                    <div className="">
                        <div className="flex items-center gap-3 mb-3">
                            <input
                                className="border-2 py-[11px] px-2 w-full"
                                placeholder="Band qilingan sanani yozing (kun,oy,yil)"
                                type="text"
                                value={filterValue.date}
                                onChange={(e) =>
                                    setFilterValue({ ...filterValue, date: e.target.value })
                                }
                            />
                            <button
                                className="green text-white border border-white py-3 px-10 button "
                                onClick={handleFilter}
                            >
                                Izlash
                            </button>
                        </div>
                    </div>
                </div>
                {Object.keys(usersAddedByDate)
                    .reverse()
                    .map((date) => (
                        <div key={date}>
                            <div className="flex gap-2 items-center mt-10 justify-between mb-5">
                                <h3 className="text-2xl text-white font-bold poppins">
                                    {date} sanasidagi band qilgan mijozlar:
                                </h3>
                            </div>
                            <table className="main_table w-full shadow-xl text-white  py-4 px-10 blur2">
                                <thead className="text-center text-2xl blur2">
                                    <tr>
                                        <td>№</td>
                                        <td className="py-4 px-10">Ismi</td>
                                        <td>Qaysi vaqtga</td>
                                        <td>Qaysi sanaga</td>
                                        <td>Qancha vaqtga</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                {/* ... */}
                                {usersAddedByDate[date]
                                    .filter((t) =>
                                        filterStatus === null ? true : t.isChecked === filterStatus
                                    )
                                    .map((t, index) => (
                                        <tbody key={t.id} className="text-center w-full">
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>{t.title}</td>
                                                <td>{t.description}</td>
                                                <td>{t.date}</td>
                                                <td>{t.time}</td>
                                                <td>
                                                    <button onClick={() => changeStatus(t._id)} className={`py-2 ml-2 px-2 ${t.isChecked
                                                        ? "text-white green rounded-md cursor-pointer"
                                                        : "text-white bg-red-700 rounded-md cursor-pointer"
                                                        }`}>
                                                        {t.isChecked ? "To`lov qilingan" : "To`lov qilinmagan"}
                                                    </button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    ))}
                            </table>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default Filter;
