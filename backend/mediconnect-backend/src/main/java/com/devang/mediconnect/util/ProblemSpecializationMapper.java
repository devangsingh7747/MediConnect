package com.devang.mediconnect.util;

import java.util.HashMap;
import java.util.Map;

public class ProblemSpecializationMapper {

    private static final Map<String, String> SPECIALIZATION_MAP = new HashMap<>();

    static {

        SPECIALIZATION_MAP.put("Chest Pain", "Cardiologist");
        SPECIALIZATION_MAP.put("Heart Problem", "Cardiologist");
        SPECIALIZATION_MAP.put("High BP", "Cardiologist");

        SPECIALIZATION_MAP.put("Headache", "Neurologist");
        SPECIALIZATION_MAP.put("Migraine", "Neurologist");
        SPECIALIZATION_MAP.put("Brain Injury", "Neurologist");

        SPECIALIZATION_MAP.put("Skin Allergy", "Dermatologist");
        SPECIALIZATION_MAP.put("Acne", "Dermatologist");

        SPECIALIZATION_MAP.put("Fever", "General Physician");
        SPECIALIZATION_MAP.put("Cold", "General Physician");
        SPECIALIZATION_MAP.put("Cough", "General Physician");

        SPECIALIZATION_MAP.put("Bone Fracture", "Orthopedic");
        SPECIALIZATION_MAP.put("Back Pain", "Orthopedic");

        SPECIALIZATION_MAP.put("Eye Pain", "Ophthalmologist");
        SPECIALIZATION_MAP.put("Vision Problem", "Ophthalmologist");

        SPECIALIZATION_MAP.put("Pregnancy", "Gynecologist");

    }

    public static String getSpecialization(String problem) {

        return SPECIALIZATION_MAP.getOrDefault(
                problem,
                "General Physician"
        );

    }

}