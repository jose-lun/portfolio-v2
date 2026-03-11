import { useState } from "react";
import profileImg from "../assets/sigma-profile.png";
import rubricImg from "../assets/sigma-rubric.png";
import surveyImg from "../assets/sigma-survey.png";
import historyImg from "../assets/sigma-history.png";
import groupImg from "../assets/sigma-group.png";

const slides = [
    {
        img: profileImg,
        heading: "Personal dashboard",
        text: "Each user has a profile with cumulative stats like total points, days tracked, and longest streak, giving a quick overview of long-term consistency.",
    },
    {
        img: rubricImg,
        heading: "Custom scoring rubrics",
        text: "Users can create their own positive and negative habits (called 'deltas' and 'nablas'), assign point values, and define targets for numeric entries, making the tracker adaptable to different routines and goals.",
    },
    {
        img: surveyImg,
        heading: "Daily check-ins",
        text: "The app turns a custom rubric into a date-based daily survey where users log completed activities and numeric progress to generate that day’s score.",
    },
    {
        img: historyImg,
        heading: "History and visualization",
        text: "Past entries are stored by date and displayed in both table and chart form, making it easy to review trends across the last 7 days, 30 days, or all time.",
    },
    {
        img: groupImg,
        heading: "Group comparison",
        text: "Users can join a shared group to compare weekly scores, track standings, and view a color-coded table of member performance across the week.",
    },
];

export default function SigmaProjectShowcase() {
    const [index, setIndex] = useState(0);
    const slide = slides[index];

    const prevSlide = () => {
        setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setIndex((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="sigma-showcase">
            <div className="sigma-showcase-top">
                <div className="sigma-showcase-copy">
                    <div className="proj-tag">React + Firebase App</div>
                    <h3 className="sigma-title">Social Habit Tracker</h3>
                    <p className="sigma-summary">
                        A multi-user habit tracking app for building custom scoring rubrics,
                        logging daily behavior, and comparing progress across groups over time.
                    </p>

                    <div className="sigma-slide-copy">
                        <div className="sigma-slide-heading">{slide.heading}</div>
                        <p>{slide.text}</p>
                    </div>

                    <div className="sigma-actions">
                        <a
                            href="https://sigma-bc106.web.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="sigma-button"
                        >
                            Open Live App
                        </a>
                    </div>
                </div>

                <div className="sigma-showcase-media">
                    <div className="sigma-image-frame">
                        <img src={slide.img} alt={slide.heading} />
                    </div>

                    <div className="sigma-controls">
                        <button onClick={prevSlide} className="sigma-arrow">
                            ←
                        </button>
                        <span className="sigma-indicator">
                            {index + 1} / {slides.length}
                        </span>
                        <button onClick={nextSlide} className="sigma-arrow">
                            →
                        </button>
                    </div>
                </div>
            </div>

            <div className="sigma-tech-box">
                <span className="sigma-tech-label">Tech Stack:</span> React, Firebase
                Authentication, Firestore, JavaScript, charting components, responsive
                CSS
            </div>
        </div>
    );
}