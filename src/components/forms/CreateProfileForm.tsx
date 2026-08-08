'use client';

import { useState } from 'react';

interface CreateProfileFormProps {
  onClose?: () => void;
}

const stepLabels = ['Personal', 'Housing', 'Lifestyle'] as const;

const inputClass =
  'w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant transition-all outline-none focus:ring-2 focus:ring-bright-cyan/30 focus:border-bright-cyan';

const labelClass =
  'block text-xs font-bold text-dark-slate mb-1.5 uppercase tracking-wide';

export default function CreateProfileForm({ onClose }: CreateProfileFormProps) {
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

  const renderStepper = () => {
    const current = step === 4 ? 3 : step;
    return (
      <div className="max-w-lg mx-auto mb-md px-1">
        <div className="flex items-center">
          {stepLabels.map((label, i) => {
            const stepNum = i + 1;
            const isActive = stepNum <= current;
            const isCurrent = stepNum === current;
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-bright-cyan text-white shadow-md shadow-bright-cyan/30'
                        : 'bg-surface-container-low text-slate-muted border border-outline-variant'
                    } ${isCurrent ? 'ring-4 ring-bright-cyan/15' : ''}`}
                  >
                    {isActive && stepNum < current ? (
                      <span className="material-symbols-outlined text-base icon-filled">
                        check
                      </span>
                    ) : (
                      stepNum
                    )}
                  </div>
                  <span
                    className={`mt-2 text-[11px] font-semibold ${
                      isActive || isCurrent
                        ? 'text-dark-slate'
                        : 'text-slate-muted'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors ${
                      stepNum < current ? 'bg-bright-cyan' : 'bg-surface-variant'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const sectionCard =
    'bg-white rounded-2xl border border-surface-variant shadow-[0_4px_16px_rgba(30,41,59,0.06)] p-5 md:p-6 w-full max-w-xl mx-auto';

  const primaryBtn =
    'flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-bright-cyan text-white font-button text-sm font-semibold hover:bg-bright-cyan/90 transition-all shadow-md shadow-bright-cyan/25 hover:shadow-lg hover:-translate-y-0.5';

  const secondaryBtn =
    'px-8 py-3.5 rounded-full border border-primary text-primary font-button text-sm font-semibold hover:bg-surface-container-low transition-colors';

  const optionActive =
    'bg-bright-cyan text-white border-bright-cyan shadow-sm font-semibold';
  const optionIdle =
    'bg-white text-on-surface border-outline-variant hover:border-bright-cyan hover:bg-bright-cyan/5';

  const optionGroup = optionActive;

  return (
    <div className="w-full text-on-surface">
      {step <= 3 ? (
        <>
          {renderStepper()}

          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center max-w-xl mx-auto mb-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary font-bold mb-sm">
                  Tell us about yourself
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  We use this to build your basic identity on the platform.
                </p>
              </div>

              <div className={sectionCard}>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className={labelClass} htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      required
                      className={inputClass}
                      id="fullName"
                      placeholder="e.g. Jane Doe"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange('fullName', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="email">
                      Email Address
                    </label>
                    <input
                      required
                      className={inputClass}
                      id="email"
                      placeholder="jane@example.com"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange('email', e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="whatsapp">
                      WhatsApp Number
                    </label>
                    <div className="flex">
                      <select
                        className="rounded-l-xl border border-r-0 border-outline-variant bg-surface-container-low px-4 py-3 text-sm text outline-none focus:ring-2 focus:ring-bright-cyan/30"
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
                        className={`${inputClass} rounded-l-none border-l-0 rounded-r-xl`}
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

                  <div>
                    <span className={labelClass}>Gender</span>
                    <div className="grid grid-cols-3 gap-3">
                      {['male', 'female', 'other'].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => handleInputChange('gender', g)}
                          className={`text-center capitalize rounded-xl border py-3 text-sm transition-colors ${
                            formData.gender === g
                              ? optionGroup
                              : optionIdle
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass} htmlFor="age">
                        Age Range
                      </label>
                      <select
                        className={inputClass}
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

                    <div>
                      <label className={labelClass} htmlFor="religion">
                        Religion
                      </label>
                      <select
                        className={inputClass}
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

                  <div>
                    <label className={labelClass} htmlFor="maritalStatus">
                      Marital Status
                    </label>
                    <select
                      className={inputClass}
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

                  <div className="pt-1">
                    <button className={`w-full ${primaryBtn}`} type="submit">
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
              <div className="text-center max-w-xl mx-auto mb-lg">
                <h1 className="font-headline-lg text-headline-lg text-primary font-bold mb-sm">
                  What are you looking for?
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Define your ideal housing situation and budget to help us find
                  the perfect match.
                </p>
              </div>

              <div className={sectionCard}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <section>
                    <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-bright-cyan text-lg">
                        apartment
                      </span>
                      Housing Situation
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                              : 'border-outline-variant bg-white hover:bg-surface-container-low'
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

                  <section>
                    <h2 className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-bright-cyan text-lg">
                        location_on
                      </span>
                      Preferred Areas
                    </h2>
                    <p className="font-body-sm text-sm text-on-surface-variant mb-3">
                      Add neighborhoods or cities you are interested in.
                    </p>

                    <div className="relative mb-3">
                      <div
                        className="relative flex items-center cursor-pointer"
                        onClick={() => setAreaDropdownOpen(!areaDropdownOpen)}
                      >
                        <span className="material-symbols-outlined absolute left-4 text-outline text-lg">
                          search
                        </span>
                        <input
                          readOnly
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-12 pr-10 py-3 font-body-md text-sm text-dark-slate cursor-pointer focus:ring-2 focus:ring-bright-cyan/30"
                          placeholder="Select areas..."
                        />
                        <span className="material-symbols-outlined absolute right-4 text-outline">
                          expand_more
                        </span>
                      </div>

                      {areaDropdownOpen && (
                        <div className="absolute z-[110] w-full mt-2 bg-white border border-outline-variant rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
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

                  <section>
                    <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-bright-cyan text-lg">
                        payments
                      </span>
                      Budget & Timeline
                    </h2>
                    <div>
                      <label className={labelClass}>Monthly Budget Range</label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">
                            ₦
                          </span>
                          <input
                            className="w-full text-sm bg-surface-container-low border border-outline-variant rounded-xl pl-8 pr-4 py-3 text-dark-slate outline-none focus:ring-2 focus:ring-bright-cyan/30"
                            placeholder="Min"
                            type="number"
                            value={formData.minBudget}
                            onChange={(e) =>
                              handleInputChange('minBudget', e.target.value)
                            }
                          />
                        </div>
                        <span className="text-on-surface-variant">-</span>
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-outline text-sm">
                            ₦
                          </span>
                          <input
                            className="w-full text-sm bg-surface-container-low border border-outline-variant rounded-xl pl-8 pr-4 py-3 text-dark-slate outline-none focus:ring-2 focus:ring-bright-cyan/30"
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

                    <div className="mt-4">
                      <label className={labelClass}>Target Move-in Month</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">
                          calendar_today
                        </span>
                        <input
                          className="w-full text-sm bg-surface-container-low border border-outline-variant rounded-xl pl-12 pr-4 py-3 text-dark-slate outline-none focus:ring-2 focus:ring-bright-cyan/30"
                          type="month"
                          value={formData.moveInDate}
                          onChange={(e) =>
                            handleInputChange('moveInDate', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </section>

                  <div className="pt-2 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className={`w-full sm:w-auto ${secondaryBtn}`}
                    >
                      Back
                    </button>
                    <button type="submit" className={`w-full sm:w-auto ${primaryBtn}`}>
                      Continue to Lifestyle
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Step 3: Lifestyle & Compatibility */}
          {step === 3 && (
            <div className="animate-in fade-in duration-300">
              <div className="text-center max-w-xl mx-auto mb-lg">
                <h1 className="font-headline text-headline-lg text-primary font-bold mb-sm">
                  Final Step: Your Lifestyle
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Help us find roommates who match your daily rhythm.
                </p>
              </div>

              <div className={sectionCard}>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Routine */}
                  <section>
                    <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-bright-cyan text-lg">
                        work
                      </span>
                      Daily Routine
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass} htmlFor="occupation">
                          Occupation
                        </label>
                        <select
                          className={inputClass}
                          id="occupation"
                          value={formData.occupation}
                          onChange={(e) =>
                            handleInputChange('occupation', e.target.value)
                          }
                        >
                          <option value="full_time">Full-time Professional</option>
                          <option value="part_time">Part-time</option>
                          <option value="student">Student</option>
                          <option value="freelance">Freelance / Remote</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="schedule">
                          Work Schedule
                        </label>
                        <select
                          className={inputClass}
                          id="schedule"
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
                  </section>

                  <hr className="border-t border-surface-variant" />

                  {/* Habits */}
                  <section>
                    <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-bright-cyan text-lg">
                        psychology
                      </span>
                      Habits & Preferences
                    </h2>
                    <div className="space-y-4">
                      {[
                        {
                          field: 'smoking' as const,
                          label: 'Smoking Habit',
                          options: [
                            { id: 'no', label: 'Non-Smoker', icon: 'smoke_free' },
                            { id: 'yes', label: 'Smoker', icon: 'smoking_rooms' },
                          ],
                        },
                        {
                          field: 'pets' as const,
                          label: 'Pet Preference',
                          options: [
                            { id: 'love', label: 'Love pets', icon: 'pets' },
                            { id: 'no', label: 'No pets', icon: 'block' },
                          ],
                        },
                        {
                          field: 'sleep' as const,
                          label: 'Sleep Schedule',
                          options: [
                            { id: 'early', label: 'Early Bird', icon: 'light_mode' },
                            { id: 'night', label: 'Night Owl', icon: 'dark_mode' },
                          ],
                        },
                      ].map((group) => (
                        <div key={group.field}>
                          <span className="block text-xs font-bold text-dark-slate mb-2 uppercase tracking-wide">
                            {group.label}
                          </span>
                          <div className="flex flex-wrap gap-3">
                            {group.options.map((opt) => (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() =>
                                  handleInputChange(group.field, opt.id)
                                }
                                className={`inline-flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-semibold transition-colors ${
                                  formData[group.field] === opt.id
                                    ? optionGroup
                                    : optionIdle
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
                      ))}
                    </div>
                  </section>

                  <hr className="border-t border-surface-variant" />

                  {/* Cleanliness */}
                  <section>
                    <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-bright-cyan text-lg">
                        cleaning_services
                      </span>
                      Cleanliness Level
                    </h2>
                    <div className="flex justify-between items-center gap-2 bg-surface-container-low p-4 rounded-xl">
                      <span className="text-xs font-semibold text-slate-muted">
                        Relaxed
                      </span>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => handleInputChange('cleanliness', lvl)}
                            className={`w-9 h-9 rounded-full border font-bold text-sm transition-all ${
                              formData.cleanliness === lvl
                                ? 'bg-bright-cyan text-white border-bright-cyan shadow-sm scale-110'
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
                  </section>

                  <hr className="border-t border-surface-variant" />

                  {/* Bio */}
                  <section>
                    <label className={labelClass} htmlFor="bio">
                      Personal Bio (Optional)
                    </label>
                    <textarea
                      className={`${inputClass} resize-none`}
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
                  </section>

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
                        I confirm that the information provided is accurate and agree
                        to the{' '}
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

                  <div className="pt-1 flex flex-col-reverse sm:flex-row justify-between items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className={`w-full sm:w-auto ${secondaryBtn}`}
                    >
                      Back
                    </button>
                    <button type="submit" className={`w-full sm:w-auto ${primaryBtn}`}>
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
        <div className="max-w-xl mx-auto py-6 md:py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
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
              Welcome,{' '}
              <span className="font-bold text-dark-slate">
                {formData.fullName || 'User'}
              </span>
              ! Your preferences are logged and our team is matching you.
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
                ₦
                {parseInt(formData.minBudget || '0').toLocaleString()} - ₦
                {parseInt(formData.maxBudget || '0').toLocaleString()}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-bright-cyan text-white px-8 py-3.5 rounded-full font-display font-semibold hover:bg-bright-cyan/90 transition-colors shadow-md"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}