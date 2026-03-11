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
    const [isAnimating, setIsAnimating] = useState(false);
    const slide = slides[index];

    const goToSlide = (nextIndex) => {
        if (isAnimating) return;

        setIsAnimating(true);

        setTimeout(() => {
            setIndex(nextIndex);
            setIsAnimating(false);
        }, 180);
    };

    const prevSlide = () => {
        goToSlide((index - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        goToSlide((index + 1) % slides.length);
    };

    return (
        <div className="proj-card sigma-card">
            <div className="sigma-card-top">
                <div className="sigma-top-row">
                    <div className="sigma-top-left">
                    </div>

                    <div className="sigma-top-center">
                        <div className="proj-title sigma-title">Social Habit Tracker</div>
                    </div>

                    <div className="sigma-top-right">
                        <a
                            href="https://sigma-bc106.web.app/"
                            target="_blank"
                            rel="noreferrer"
                            className="proj-tag sigma-live-button sigma-pill"
                            style={{ background: "rgba(42, 204, 99, 0.61)" }}
                        >
                            Open Live App
                        </a>
                    </div>
                </div>

                <p className="proj-desc sigma-summary">
                    A multi-user habit tracking app for building custom scoring rubrics,
                    logging daily behavior, and comparing progress across groups over time.
                </p>
            </div>

            <div className="sigma-card-main">
                <div className="sigma-card-left">
                    <div className={`sigma-slide-copy ${isAnimating ? "sigma-fade-out" : "sigma-fade-in"}`}>
                        <div className="sigma-slide-heading">{slide.heading}</div>
                        <p>{slide.text}</p>
                    </div>
                </div>

                <div className="sigma-card-right">
                    <div className={`sigma-image-frame ${isAnimating ? "sigma-fade-out" : "sigma-fade-in"}`}>
                        <img src={slide.img} alt={slide.heading} />
                    </div>

                    <div className="sigma-controls">
                        <button onClick={prevSlide} className="sigma-arrow" aria-label="Previous slide">
                            ←
                        </button>
                        <span className="sigma-indicator">
                            {index + 1} / {slides.length}
                        </span>
                        <button onClick={nextSlide} className="sigma-arrow" aria-label="Next slide">
                            →
                        </button>
                    </div>
                </div>
            </div>

            <div className="proj-tech sigma-tech">
                <span className="proj-tech-label">Tech Stack: </span> React, Firebase
                Authentication, Firestore, JavaScript, Responsive CSS
            </div>
        </div>
    );
}