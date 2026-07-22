import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaHeartbeat,
    FaStethoscope,
    FaCheckCircle,
    FaExclamationTriangle
} from "react-icons/fa";

import PatientLayout from "../../components/patient/PatientLayout";

const symptomOptions = [

    "Fever",
    "Headache",
    "Cough",
    "Cold",
    "Body Pain",
    "Fatigue",
    "Chest Pain",
    "High BP",
    "Migraine",
    "Skin Allergy",
    "Acne",
    "Back Pain",
    "Eye Pain",
    "Vision Problem"

];

const analysisRules = [

    {
        symptoms: ["Fever", "Cough", "Cold"],
        condition: "Possible viral infection or seasonal flu",
        specialist: "General Physician",
        appointmentProblem: "Fever"
    },

    {
        symptoms: ["Headache", "Migraine"],
        condition: "Possible migraine or stress-related headache",
        specialist: "Neurologist",
        appointmentProblem: "Migraine"
    },

    {
        symptoms: ["Chest Pain", "High BP"],
        condition: "Possible cardiovascular concern",
        specialist: "Cardiologist",
        appointmentProblem: "Chest Pain"
    },

    {
        symptoms: ["Skin Allergy", "Acne"],
        condition: "Possible skin-related condition",
        specialist: "Dermatologist",
        appointmentProblem: "Skin Allergy"
    },

    {
        symptoms: ["Back Pain", "Body Pain"],
        condition: "Possible muscle or bone-related concern",
        specialist: "Orthopedic",
        appointmentProblem: "Back Pain"
    },

    {
        symptoms: ["Eye Pain", "Vision Problem"],
        condition: "Possible eye-related condition",
        specialist: "Ophthalmologist",
        appointmentProblem: "Eye Pain"
    }

];

const DiseaseAnalysis = () => {

    const navigate = useNavigate();

    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showValidation, setShowValidation] = useState(false);

    const selectedCount = selectedSymptoms.length;

    const toggleSymptom = (symptom) => {

        setShowValidation(false);
        setAnalysisResult(null);

        setSelectedSymptoms((previous) => {

            if (previous.includes(symptom)) {

                return previous.filter(
                    (selectedSymptom) =>
                        selectedSymptom !== symptom
                );

            }

            return [
                ...previous,
                symptom
            ];

        });

    };

    const matchedRule = useMemo(() => {

        return analysisRules.find((rule) =>

            rule.symptoms.some((symptom) =>
                selectedSymptoms.includes(symptom)
            )

        );

    }, [selectedSymptoms]);

    const handleAnalyze = () => {

        if (selectedSymptoms.length === 0) {

            setShowValidation(true);
            setAnalysisResult(null);

            return;

        }

        if (matchedRule) {

            setAnalysisResult(matchedRule);

        } else {

            setAnalysisResult({

                condition: "The selected symptoms require professional evaluation",
                specialist: "General Physician",
                appointmentProblem: selectedSymptoms[0]

            });

        }

    };

    const handleBookAppointment = () => {

        const problem = analysisResult?.appointmentProblem || "";

        navigate(
            `/appointment?problem=${encodeURIComponent(problem)}`
        );

    };

    const handleReset = () => {

        setSelectedSymptoms([]);
        setAnalysisResult(null);
        setShowValidation(false);

    };

    return (

        <PatientLayout>

            <div className="space-y-6">

                <div>

                    <h1 className="text-3xl font-bold text-gray-800">

                        Disease Analysis

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Select your symptoms to receive basic health guidance.

                    </p>

                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">

                    <FaExclamationTriangle className="text-yellow-600 text-xl mt-1 shrink-0" />

                    <p className="text-sm text-yellow-800">

                        This tool provides general guidance only and does not replace professional medical advice, diagnosis, or emergency care.

                    </p>

                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                    <div className="xl:col-span-2 bg-white rounded-2xl shadow p-6">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                            <div>

                                <h2 className="text-2xl font-semibold text-gray-800">

                                    Select Symptoms

                                </h2>

                                <p className="text-sm text-gray-500 mt-1">

                                    You can select more than one symptom.

                                </p>

                            </div>

                            <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">

                                {selectedCount} selected

                            </span>

                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">

                            {symptomOptions.map((symptom) => {

                                const isSelected =
                                    selectedSymptoms.includes(symptom);

                                return (

                                    <button
                                        key={symptom}
                                        type="button"
                                        onClick={() =>
                                            toggleSymptom(symptom)
                                        }
                                        className={`
                                            rounded-xl
                                            border
                                            px-4
                                            py-4
                                            text-sm
                                            font-semibold
                                            cursor-pointer
                                            transition-all
                                            duration-200
                                            ${
                                                isSelected
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                                    : "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100 hover:border-blue-400 hover:-translate-y-0.5"
                                            }
                                        `}
                                    >

                                        <span className="flex items-center justify-center gap-2">

                                            {isSelected && (
                                                <FaCheckCircle />
                                            )}

                                            {symptom}

                                        </span>

                                    </button>

                                );

                            })}

                        </div>

                        {showValidation && (

                            <p className="text-red-600 text-sm mt-4">

                                Please select at least one symptom.

                            </p>

                        )}

                        <div className="flex flex-col sm:flex-row gap-3 mt-8">

                            <button
                                type="button"
                                onClick={handleAnalyze}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition cursor-pointer"
                            >

                                Analyze Symptoms

                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="sm:w-36 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl transition cursor-pointer"
                            >

                                Reset

                            </button>

                        </div>

                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white rounded-2xl shadow p-6">

                        <FaHeartbeat className="text-4xl" />

                        <h2 className="text-2xl font-bold mt-5">

                            Health Guidance

                        </h2>

                        <p className="text-blue-100 mt-3 leading-relaxed">

                            Choose the symptoms you are currently experiencing. MediConnect will suggest a suitable specialist based on the selected symptoms.

                        </p>

                        <div className="bg-white/15 rounded-xl p-4 mt-6">

                            <p className="text-sm text-blue-100">

                                Seek urgent medical assistance for severe chest pain, breathing difficulty, unconsciousness, or other emergencies.

                            </p>

                        </div>

                    </div>

                </div>

                {analysisResult && (

                    <div className="bg-white rounded-2xl shadow p-6 border border-blue-100">

                        <div className="flex items-center gap-3">

                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">

                                <FaStethoscope className="text-2xl" />

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">

                                    Analysis Result

                                </p>

                                <h2 className="text-2xl font-bold text-gray-800">

                                    Basic Health Guidance

                                </h2>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">

                                <p className="text-sm text-gray-500">

                                    Possible Concern

                                </p>

                                <p className="font-semibold text-gray-800 mt-2">

                                    {analysisResult.condition}

                                </p>

                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-xl p-5">

                                <p className="text-sm text-gray-500">

                                    Recommended Specialist

                                </p>

                                <p className="font-semibold text-green-700 mt-2">

                                    {analysisResult.specialist}

                                </p>

                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={handleBookAppointment}
                            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
                        >

                            Book an Appointment

                        </button>

                    </div>

                )}

            </div>

        </PatientLayout>

    );

};

export default DiseaseAnalysis;