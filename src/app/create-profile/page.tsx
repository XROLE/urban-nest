'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CreateProfile() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    email: '',
    countryCode: '+234',
    whatsapp: '',
    gender: 'male',
    ageRange: '18 - 24',
    religion: 'Prefer not to say',
    maritalStatus: 'Single',

    // Step 2
    housingSituation: 'rent_together',
    preferredAreas: ['Lekki Phase 1', 'Yaba'],
    areaInput: '',
    minBudget: '400000',
    maxBudget: '900000',
    moveInDate: '2026-09',

    // Step 3
    occupation: 'full_time',
    schedule: 'standard',
    smoking: 'no',
    pets: 'love',
    sleep: 'early',
    cleanliness: 3,
    bio: '',
    consent: false,
  });

  const availableAreas = [
    'Lekki Phase 1',
    'Yaba',
    'Ikeja GRA',
    'Victoria Island',
    'Ikoyi',
    'Surulere',
    'Gbagada',
    'Abuja Central',
  ];

  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addArea = (area: string) => {
    if (!formData.preferredAreas.includes(area)) {
      setFormData((prev) => ({
        ...prev,
        preferredAreas: [...prev.preferredAreas, area],
      }));
    }
    setAreaDropdownOpen(false);
  };

  const removeArea = (areaToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredAreas: prev.preferredAreas.filter((a) => a !== areaToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((step + 1) as 1 | 2 | 3);
    } else {
      setStep(4); // Submitted state
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar minimal />

      <main className="flex-grow w-full max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        {step <= 3 ? (
          <>
            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto mb-lg">
              <div className="flex justify-between items-center mb-xs">
                <span className="font-label-bold text-label-bold text-primary">
                  Step {step} of 3
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {step === 1 ? '33%' : step === 2 ? '66%' : '100%'} Complete
                </span>
              </div>
              <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden">
                <div
                  className="bg-secondary-container h-2 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: step === 1 ? '33%' : step === 2 ? '66%' : '100%',
                  }}
                />
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {step === 1 && (
              <div className="animate-in fade-in duration-300">
                <div className="mb-lg text-center max-w-2xl mx-auto">
                  <h1 className="font-headline-lg text-headline-lg md:font-headline-xl md:text-headline-xl text-primary mb-xs font-bold">
                    Tell us about yourself
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    We use this to build your basic identity on the platform.
                  </p>
                </div>

                <div className="bg-surface-container-lowest rounded-2xl border border-surface-variant shadow-[0_4px_12px_rgba(30,41,59,0.05)] p-md md:p-lg w-full max-w-2xl mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-md">
                    {/* Full Name */}
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-primary mb-xs"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <input
                        required
                        className="w-full rounded-full border border-outline-variant px-4 py-3 font-body-md text-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary-container bg-surface-container-low outline-none transition-all"
                        id="fullName"
                        placeholder="e.g. Jane Doe"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange('fullName', e.target.value)
                        }
                      />
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-primary mb-xs"
                        htmlFor="email"
                      >
                        Email Address
                      </label>
                      <input
                        required
                        className="w-full rounded-full border border-outline-variant px-4 py-3 font-body-md text-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary-container bg-surface-container-low outline-none transition-all"
                        id="email"
                        placeholder="jane@example.com"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange('email', e.target.value)
                        }
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-primary mb-xs"
                        htmlFor="whatsapp"
                      >
                        WhatsApp Number
                      </label>
                      <div className="flex">
                        <select
                          className="rounded-l-full border border-r-0 border-outline-variant px-4 py-3 font-body-md text-body-md bg-surface-container-low focus:ring-2 focus:ring-secondary-container outline-none"
                          value={formData.countryCode}
                          onChange={(e) =>
                            handleInputChange('countryCode', e.target.value)
                          }
                        >
                          <option>+234</option>
                          <option>+1</option>
                          <option>+44</option>
                        </select>
                        <input
                          required
                          className="w-full rounded-r-full border border-outline-variant px-4 py-3 font-body-md text-body-md focus:ring-2 focus:ring-secondary-container focus:border-secondary-container bg-surface-container-low outline-none"
                          id="whatsapp"
                          placeholder="801 234 5678"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={(e) =>
                            handleInputChange('whatsapp', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block font-label-bold text-label-bold text-primary mb-xs">
                        Gender
                      </label>
                      <div className="flex space-x-2">
                        {['male', 'female', 'other'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => handleInputChange('gender', g)}
                            className={`flex-1 text-center capitalize rounded-full border py-3 font-body-md transition-colors ${
                              formData.gender === g
                                ? 'bg-primary text-white border-primary font-semibold'
                                : 'bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-variant'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      {/* Age Range */}
                      <div>
                        <label
                          className="block font-label-bold text-label-bold text-primary mb-xs"
                          htmlFor="age"
                        >
                          Age Range
                        </label>
                        <select
                          className="w-full rounded-full border border-outline-variant px-4 py-3 font-body-md text-body-md bg-surface-container-low focus:ring-2 focus:ring-secondary-container outline-none"
                          id="age"
                          value={formData.ageRange}
                          onChange={(e) =>
                            handleInputChange('ageRange', e.target.value)
                          }
                        >
                          <option>18 - 24</option>
                          <option>25 - 34</option>
                          <option>35 - 44</option>
                          <option>45+</option>
                        </select>
                      </div>

                      {/* Religion */}
                      <div>
                        <label
                          className="block font-label-bold text-label-bold text-primary mb-xs"
                          htmlFor="religion"
                        >
                          Religion
                        </label>
                        <select
                          className="w-full rounded-full border border-outline-variant px-4 py-3 font-body-md text-body-md bg-surface-container-low focus:ring-2 focus:ring-secondary-container outline-none"
                          id="religion"
                          value={formData.religion}
                          onChange={(e) =>
                            handleInputChange('religion', e.target.value)
                          }
                        >
                          <option>Prefer not to say</option>
                          <option>Christianity</option>
                          <option>Islam</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>

                    {/* Marital Status */}
                    <div>
                      <label
                        className="block font-label-bold text-label-bold text-primary mb-xs"
                        htmlFor="maritalStatus"
                      >
                        Marital Status
                      </label>
                      <select
                        className="w-full rounded-full border border-outline-variant px-4 py-3 font-body-md text-body-md bg-surface-container-low focus:ring-2 focus:ring-secondary-container outline-none"
                        id="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={(e) =>
                          handleInputChange('maritalStatus', e.target.value)
                        }
                      >
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-sm">
                      <button
                        className="w-full flex justify-center items-center rounded-full bg-bright-cyan text-white py-4 font-button text-button hover:bg-bright-cyan/90 transition-colors shadow-md gap-2 font-semibold"
                        type="submit"
                      >
                        Continue to Housing Needs
                        <span className="material-symbols-outlined text-[20px]">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Step 2: Housing Needs */}
            {step === 2 && (
              <div className="animate-in fade-in duration-300">
                <div className="text-center max-w-2xl mx-auto mb-lg">
                  <h1 className="font-headline-lg text-headline-lg md:text-headline-xl text-primary font-bold mb-sm">
                    What are you looking for?
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Define your ideal housing situation and budget to help us find the perfect match.
                  </p>
                </div>

                <div className="max-w-2xl mx-auto bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-sm p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Housing Situation Section */}
                    <section>
                      <h2 className="font-headline-md text-lg font-bold text-primary mb-4">
                        Housing Situation
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          {
                            value: 'have_apartment',
                            label: 'I have an apartment',
                            icon: 'apartment',
                          },
                          {
                            value: 'rent_together',
                            label: 'Rent together',
                            icon: 'group',
                          },
                          {
                            value: 'need_room',
                            label: 'Looking for a room',
                            icon: 'bed',
                          },
                        ].map((item) => (
                          <div
                            key={item.value}
                            onClick={() =>
                              handleInputChange('housingSituation', item.value)
                            }
                            className={`cursor-pointer border rounded-xl p-4 text-center flex flex-col items-center justify-center gap-2 transition-all ${
                              formData.housingSituation === item.value
                                ? 'border-bright-cyan ring-2 ring-bright-cyan/20 bg-bright-cyan/5'
                                : 'border-outline-variant hover:bg-surface-container-low'
                            }`}
                          >
                            <span className="material-symbols-outlined text-bright-cyan text-3xl">
                              {item.icon}
                            </span>
                            <span className="font-label-bold text-sm text-dark-slate font-semibold">
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>

                    <hr className="border-t border-surface-variant" />

                    {/* Preferred Areas Section */}
                    <section>
                      <h2 className="font-headline-md text-lg font-bold text-primary mb-1">
                        Preferred Areas
                      </h2>
                      <p className="font-body-sm text-sm text-on-surface-variant mb-4">
                        Add neighborhoods or cities you are interested in.
                      </p>

                      <div className="relative mb-3">
                        <div
                          className="relative flex items-center cursor-pointer"
                          onClick={() =>
                            setAreaDropdownOpen(!areaDropdownOpen)
                          }
                        >
                          <span className="material-symbols-outlined absolute left-4 text-outline">
                            search
                          </span>
                          <input
                            readOnly
                            className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-12 pr-10 py-3 font-body-md text-sm text-dark-slate cursor-pointer"
                            placeholder="Select areas..."
                          />
                          <span className="material-symbols-outlined absolute right-4 text-outline">
                            expand_more
                          </span>
                        </div>

                        {areaDropdownOpen && (
                          <div className="absolute z-20 w-full mt-2 bg-white border border-outline-variant rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                            {availableAreas.map((area) => (
                              <div
                                key={area}
                                onClick={() => addArea(area)}
                                className="p-3 hover:bg-bright-cyan/10 cursor-pointer font-body-md text-sm text-dark-slate transition-colors"
                              >
                                {area}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Selected Areas Badges */}
                      <div className="flex flex-wrap gap-2">
                        {formData.preferredAreas.map((area) => (
                          <span
                            key={area}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bright-cyan/10 text-bright-cyan border border-bright-cyan/20 text-xs font-semibold"
                          >
                            {area}
                            <button
                              type="button"
                              onClick={() => removeArea(area)}
                              className="hover:text-dark-slate"
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                          </span>
                        ))}
                      </div>
                    </section>

                    <hr className="border-t border-surface-variant" />

                    {/* Budget & Timeline Section */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h2 className="font-headline-md text-base font-bold text-primary mb-2">
                          Monthly Budget Range
                        </h2>
                        <div className="flex items-center gap-2">
                          <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">
                              ₦
                            </span>
                            <input
                              className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-8 pr-4 py-2.5 font-body-md text-sm text-dark-slate outline-none"
                              placeholder="Min"
                              type="number"
                              value={formData.minBudget}
                              onChange={(e) =>
                                handleInputChange('minBudget', e.target.value)
                              }
                            />
                          </div>
                          <span className="text-on-surface-variant">-</span>
                          <div className="relative w-full">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">
                              ₦
                            </span>
                            <input
                              className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-8 pr-4 py-2.5 font-body-md text-sm text-dark-slate outline-none"
                              placeholder="Max"
                              type="number"
                              value={formData.maxBudget}
                              onChange={(e) =>
                                handleInputChange('maxBudget', e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h2 className="font-headline-md text-base font-bold text-primary mb-2">
                          Target Move-in Month
                        </h2>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                            calendar_today
                          </span>
                          <input
                            className="w-full bg-surface-container-low border border-outline-variant rounded-full pl-12 pr-4 py-2.5 font-body-md text-sm text-dark-slate outline-none"
                            type="month"
                            value={formData.moveInDate}
                            onChange={(e) =>
                              handleInputChange('moveInDate', e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </section>

                    {/* Navigation Buttons */}
                    <div className="pt-4 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="w-full md:w-auto px-8 py-3 rounded-full border border-primary text-primary font-button hover:bg-surface-container-low transition-colors font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-full md:w-auto px-8 py-3 rounded-full bg-bright-cyan text-white font-button hover:bg-bright-cyan/90 transition-all shadow-md flex items-center justify-center gap-2 font-semibold"
                      >
                        Continue to Lifestyle
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Step 3: Lifestyle & Compatibility */}
            {step === 3 && (
              <div className="animate-in fade-in duration-300">
                <div className="text-center max-w-2xl mx-auto mb-lg">
                  <p className="text-body-sm font-label-bold text-bright-cyan mb-1 uppercase tracking-widest font-semibold">
                    Step 3 of 3
                  </p>
                  <h1 className="font-headline-lg text-headline-lg md:text-headline-xl text-primary font-bold mb-xs">
                    Final Step: Your Lifestyle
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Help us find roommates who match your daily rhythm.
                  </p>
                </div>

                <div className="max-w-2xl mx-auto bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-sm p-6 md:p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Routine */}
                    <div>
                      <h2 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-bright-cyan">
                          work
                        </span>
                        Daily Routine
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-dark-slate mb-1">
                            Occupation Status
                          </label>
                          <select
                            className="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2.5 text-sm text-dark-slate outline-none"
                            value={formData.occupation}
                            onChange={(e) =>
                              handleInputChange('occupation', e.target.value)
                            }
                          >
                            <option value="full_time">
                              Full-time Professional
                            </option>
                            <option value="part_time">Part-time</option>
                            <option value="student">Student</option>
                            <option value="freelance">Freelance / Remote</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-dark-slate mb-1">
                            Work Schedule
                          </label>
                          <select
                            className="w-full bg-surface-container-low border border-surface-variant rounded-lg px-3 py-2.5 text-sm text-dark-slate outline-none"
                            value={formData.schedule}
                            onChange={(e) =>
                              handleInputChange('schedule', e.target.value)
                            }
                          >
                            <option value="standard">Standard (9 to 5)</option>
                            <option value="flexible">Flexible / Remote</option>
                            <option value="shift">Shift Work</option>
                            <option value="night">Night Shift</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <hr className="border-surface-variant" />

                    {/* Habits */}
                    <div>
                      <h2 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-bright-cyan">
                          psychology
                        </span>
                        Habits & Preferences
                      </h2>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-dark-slate mb-2">
                            Smoking Habit
                          </label>
                          <div className="flex gap-3">
                            {[
                              {
                                id: 'no',
                                label: 'Non-Smoker',
                                icon: 'smoke_free',
                              },
                              { id: 'yes', label: 'Smoker', icon: 'smoking_rooms' },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() =>
                                  handleInputChange('smoking', opt.id)
                                }
                                className={`inline-flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs font-semibold transition-colors ${
                                  formData.smoking === opt.id
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-variant'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {opt.icon}
                                </span>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-dark-slate mb-2">
                            Pet Preference
                          </label>
                          <div className="flex gap-3">
                            {[
                              {
                                id: 'love',
                                label: 'Love pets',
                                icon: 'pets',
                              },
                              { id: 'no', label: 'No pets', icon: 'block' },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleInputChange('pets', opt.id)}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs font-semibold transition-colors ${
                                  formData.pets === opt.id
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-variant'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {opt.icon}
                                </span>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-dark-slate mb-2">
                            Sleep Schedule
                          </label>
                          <div className="flex gap-3">
                            {[
                              {
                                id: 'early',
                                label: 'Early Bird',
                                icon: 'light_mode',
                              },
                              {
                                id: 'night',
                                label: 'Night Owl',
                                icon: 'dark_mode',
                              },
                            ].map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleInputChange('sleep', opt.id)}
                                className={`inline-flex items-center gap-1.5 px-4 py-2 border rounded-full text-xs font-semibold transition-colors ${
                                  formData.sleep === opt.id
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-variant'
                                }`}
                              >
                                <span className="material-symbols-outlined text-base">
                                  {opt.icon}
                                </span>
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <hr className="border-surface-variant" />

                    {/* Cleanliness */}
                    <div>
                      <h2 className="text-base font-bold text-primary mb-3 flex items-center gap-2">
                        <span className="material-symbols-outlined text-bright-cyan">
                          cleaning_services
                        </span>
                        Cleanliness Level (1 - 5)
                      </h2>
                      <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl">
                        <span className="text-xs font-semibold text-slate-muted">
                          Relaxed
                        </span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() =>
                                handleInputChange('cleanliness', lvl)
                              }
                              className={`w-9 h-9 rounded-full border font-bold text-sm transition-all ${
                                formData.cleanliness === lvl
                                  ? 'bg-bright-cyan text-white border-bright-cyan shadow-sm'
                                  : 'bg-white text-dark-slate border-outline-variant hover:border-bright-cyan'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-slate-muted">
                          Immaculate
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <div>
                      <label
                        className="block text-xs font-bold text-dark-slate mb-1"
                        htmlFor="bio"
                      >
                        Personal Bio (Optional)
                      </label>
                      <textarea
                        className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-3 text-sm text-dark-slate outline-none resize-none"
                        id="bio"
                        maxLength={200}
                        rows={3}
                        placeholder="A quick blurb about yourself, your hobbies, or what makes you a great roommate..."
                        value={formData.bio}
                        onChange={(e) =>
                          handleInputChange('bio', e.target.value)
                        }
                      />
                      <div className="text-right text-xs text-slate-400 mt-1">
                        {formData.bio.length} / 200
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="bg-surface-container-low p-4 rounded-xl border border-surface-variant">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          required
                          type="checkbox"
                          className="mt-1 rounded border-outline focus:ring-bright-cyan"
                          checked={formData.consent}
                          onChange={(e) =>
                            handleInputChange('consent', e.target.checked)
                          }
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          I confirm that the information provided is accurate and agree to the{' '}
                          <a href="#" className="text-bright-cyan underline font-semibold">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-bright-cyan underline font-semibold">
                            Privacy Policy
                          </a>
                          .
                        </span>
                      </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="pt-2 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full md:w-auto px-8 py-3 rounded-full border border-primary text-primary font-button hover:bg-surface-container-low transition-colors font-semibold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="w-full md:w-auto px-10 py-3 rounded-full bg-bright-cyan text-white font-button hover:bg-bright-cyan/90 transition-all shadow-md font-semibold"
                      >
                        Complete My Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Step 4: Submission Confirmation State */
          <div className="max-w-xl mx-auto py-12 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-mint/10 text-mint rounded-full flex items-center justify-center mx-auto border-4 border-mint/20 shadow-lg">
              <span className="material-symbols-outlined text-4xl icon-filled">
                check_circle
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="font-display text-3xl font-extrabold text-dark-slate">
                Profile Created Successfully!
              </h1>
              <p className="font-body text-slate-muted text-base">
                Welcome, <span className="font-bold text-dark-slate">{formData.fullName || 'User'}</span>! Your preferences are logged and our team is matching you.
              </p>
            </div>

            <div className="bg-surface-container-lowest border border-slate-200 rounded-2xl p-6 text-left space-y-3 shadow-sm">
              <h3 className="font-display font-bold text-sm text-dark-slate uppercase tracking-wider">
                Profile Summary
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                <div>
                  <span className="text-slate-400 block text-xs">Email</span>
                  {formData.email || 'jane@example.com'}
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">WhatsApp</span>
                  {formData.countryCode} {formData.whatsapp || '801 234 5678'}
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Areas</span>
                  {formData.preferredAreas.join(', ')}
                </div>
                <div>
                  <span className="text-slate-400 block text-xs">Budget Range</span>
                  ₦{parseInt(formData.minBudget || '0').toLocaleString()} - ₦{parseInt(formData.maxBudget || '0').toLocaleString()}
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/admin/dashboard"
                className="bg-dark-slate text-white px-8 py-3.5 rounded-full font-display font-semibold hover:bg-slate-800 transition-colors shadow-md"
              >
                View Admin Matchmaker
              </Link>
              <Link
                href="/"
                className="bg-bright-cyan text-white px-8 py-3.5 rounded-full font-display font-semibold hover:bg-bright-cyan/90 transition-colors shadow-md"
              >
                Return to Home
              </Link>
            </div>
          </div>
        )}
      </main>

      <Footer showMobileStickyCta={false} />
    </div>
  );
}
