'use client';

import { useState } from 'react';
import Modal from '@/components/Modal';

interface CreateProfileFormProps {
  onClose?: () => void;
}

const stepLabels = ['Personal', 'Housing', 'Lifestyle'] as const;

const inputClass =
  'w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface placeholder:text-outline-variant transition-all outline-none focus:ring-2 focus:ring-bright-cyan/30 focus:border-bright-cyan';

const labelClass =
  'block text-xs font-bold text-dark-slate mb-1.5 uppercase tracking-wide';

const selectClass = `${inputClass} appearance-none pr-10 cursor-pointer`;

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
    state: 'Lagos',
    preferredArea: 'Lekki Phase 1',
    minBudget: '400000',
    maxBudget: '900000',
    moveInDate: '2026-09',

    // Step 3
    occupation: 'full_time',
    schedule: 'standard',
    bio: '',
    consent: false,
  });

  const availableAreas = [
    'Ajah',
    'Abijo',
    'Agungi',
    'Awoyaya',
    'Banana Island',
    'Chevron',
    'Epe',
    'Igbo Efon',
    'Ikate',
    'Ikoyi',
    'Ikota',
    'Lafiaji',
    'Lekki Phase 1',
    'Lekki Phase 2',
    'Okun Ajah',
    'Oniru',
    'Orchid',
    'Sangotedo',
    'Victoria Island (VI)',

    // --- MAINLAND CENTRAL ---
    'Akoka',
    'Alagomeji',
    'Allen Avenue (Ikeja)',
    'Anthony Village',
    'Bode Thomas (Surulere)',
    'Ebute Metta',
    'Gbagada Phase 1',
    'Gbagada Phase 2',
    'Ikeja',
    'Ikeja GRA',
    'Ilupeju',
    'Magodo Phase 1',
    'Magodo Phase 2',
    'Maryland',
    'Ogudu',
    'Ogudu GRA',
    'Omole Phase 1',
    'Omole Phase 2',
    'Opebi (Ikeja)',
    'Oregun',
    'Sabo (Yaba)',
    'Surulere',
    'Yaba',

    // --- MAINLAND SUBURBS & OUTER ZONES ---
    'Agege',
    'Akowonjo',
    'Amuwo-Odofin',
    'Badagry',
    'Berger',
    'Egbeda',
    'Festac Town',
    'Ifako-Ijaiye',
    'Ikorodu',
    'Ipaja',
    'Isolo',
    'Mile 2',
    'Ojodu',
    'Ojota',
    'Ojo',
    'Okota',
    'Oshodi',
  ];

  const availableStates = ['Lagos'];

  const [areaDropdownOpen, setAreaDropdownOpen] = useState(false);
  const [searchArea, setSearchArea] = useState('');
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const filteredAreas = availableAreas.filter((area) =>
    area.toLowerCase().includes(searchArea.trim().toLowerCase())
  );

  const selectArea = (area: string) => {
    handleInputChange('preferredArea', area);
    setSearchArea('');
    setAreaDropdownOpen(false);
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
                      <div className="relative">
                        <select
                          className={selectClass}
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
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass} htmlFor="religion">
                        Religion
                      </label>
                      <div className="relative">
                        <select
                          className={selectClass}
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
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="maritalStatus">
                      Marital Status
                    </label>
<div className="relative">
                    <select
                      className={selectClass}
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
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                      expand_more
                    </span>
                  </div>
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
                    <h2 className="text-sm font-bold text-primary mb-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-bright-cyan text-lg">
                        location_on
                      </span>
                      Preferred Area
                    </h2>
                    <p className="font-body-sm text-sm text-on-surface-variant mb-3">
                      Select your state, then the neighborhood or city you are
                      interested in.
                    </p>

                    <div className="mb-4">
                      <label className={labelClass} htmlFor="state">
                        State
                      </label>
                      <div className="relative">
                        <select
                          className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                          id="state"
                          value={formData.state}
                          onChange={(e) =>
                            handleInputChange('state', e.target.value)
                          }
                        >
                          {availableStates.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>

                    <div className="relative mb-3">
                      <div
                        className="relative flex items-center cursor-pointer"
                        onClick={() => setAreaDropdownOpen(!areaDropdownOpen)}
                      >
                        <span className="material-symbols-outlined absolute left-4 text-outline text-lg">
                          search
                        </span>
                        <input
                          className="w-full bg-surface-container-low border border-outline-variant rounded-xl pl-12 pr-10 py-3 font-body-md text-sm text-dark-slate focus:ring-2 focus:ring-bright-cyan/30 outline-none"
                          placeholder="Search your area..."
                          value={
                            areaDropdownOpen
                              ? searchArea
                              : formData.preferredArea
                          }
                          onChange={(e) => setSearchArea(e.target.value)}
                          onFocus={() => setAreaDropdownOpen(true)}
                        />
                        <span className="material-symbols-outlined absolute right-4 text-outline">
                          expand_more
                        </span>
                      </div>

                      {areaDropdownOpen && (
                        <div className="absolute z-[110] w-full mt-2 bg-white border border-outline-variant rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                          {filteredAreas.length > 0 ? (
                            filteredAreas.map((area) => (
                              <div
                                key={area}
                                onClick={() => selectArea(area)}
                                className={`p-3 cursor-pointer font-body-md text-sm transition-colors ${
                                  formData.preferredArea === area
                                    ? 'bg-bright-cyan/10 text-bright-cyan font-semibold'
                                    : 'text-dark-slate hover:bg-bright-cyan/10'
                                }`}
                              >
                                {area}
                              </div>
                            ))
                          ) : (
                            <div className="p-3 text-sm text-slate-muted">
                              No areas match &quot;{searchArea}&quot;.
                            </div>
                          )}
                        </div>
                      )}
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
                        <div className="relative">
                          <select
                            className={selectClass}
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
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className={labelClass} htmlFor="schedule">
                          Work Schedule
                        </label>
<div className="relative">
                          <select
                            className={selectClass}
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
                          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
                            expand_more
                          </span>
                        </div>
                      </div>
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
                        I confirm that the information provided is accurate and
                        agree to the{' '}
                        <button
                          type="button"
                          onClick={() => setShowTerms(true)}
                          className="text-bright-cyan underline font-semibold"
                        >
                          Terms of Service
                        </button>{' '}
                        and{' '}
                        <button
                          type="button"
                          onClick={() => setShowPrivacy(true)}
                          className="text-bright-cyan underline font-semibold"
                        >
                          Privacy Policy
                        </button>
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
                <span className="text-slate-400 block text-xs">State</span>
                {formData.state}
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Area</span>
                {formData.preferredArea}
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

      <Modal open={showTerms} onClose={() => setShowTerms(false)} title="Terms of Service">
        <div className="p-6 md:p-8 overflow-y-auto min-h-0">
          <h2 className="font-display text-xl font-extrabold text-dark-slate mb-3">
            Terms of Service
          </h2>
          <div className="font-body text-sm text-slate-500 space-y-3">
            <p>
              By creating a profile on Roommate NG, you agree to provide
              accurate information and use the platform to find compatible,
              trustworthy roommates.
            </p>
            <p>
              You are responsible for the accuracy of the details you share and
              for your interactions with other members. Roommate NG reserves
              the right to suspend accounts that violate these terms.
            </p>
            <p>
              We may update these terms at any time. Continued use constitutes
              acceptance of any changes.
            </p>
          </div>
        </div>
      </Modal>

      <Modal open={showPrivacy} onClose={() => setShowPrivacy(false)} title="Privacy Policy">
        <div className="p-6 md:p-8 overflow-y-auto min-h-0">
          <h2 className="font-display text-xl font-bold text-dark-slate mb-3">
            Privacy Policy
          </h2>
          <div className="font-body text-sm text-slate-600 space-y-3">
            <p>
              We collect the information you provide when creating a profile to
              match you with compatible roommates and improve the platform.
            </p>
            <p>
              Your personal data will not be sold to third parties. It may be
              shared with service providers only as necessary to deliver our
              services and comply with legal obligations.
            </p>
            <p>
              For questions about your data, please contact our support team.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}