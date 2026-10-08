import React from 'react';
import {
  COSTING_RINGS,
  FEATURE_MODULES,
  PLATFORM_FUNCTIONS,
} from '../lib/proposal-data';
import { RefreshCw, CheckCircle2, Lock } from 'lucide-react';

interface MemberCabinetProps {
  enabledFunctionIds: string[];
  onToggleFunction: (fnId: string) => void;
  onOpenWorkspace: () => void;
}

export const MemberCabinet: React.FC<MemberCabinetProps> = ({
  enabledFunctionIds,
  onToggleFunction,
  onOpenWorkspace,
}) => {
  return (
    <section
      aria-label="Service deck · Customisable network services"
      className="bg-white border-2 border-[#123C3A] rounded-xl p-6 shadow-md space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#123C3A]/15 pb-4">
        <div>
          <span className="font-mono-tech text-xs uppercase tracking-widest text-[#B5481A]">
            CONFIGURABLE PRODUCT SCOPE · 4 SEQUENTIAL COSTING RINGS
          </span>
          <h2 className="font-isrm-heading font-bold text-2xl text-[#0B544C] mt-1">
            Service deck · Customisable network services
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenWorkspace}
          className="px-4 py-2 rounded font-display-oswald text-sm uppercase tracking-wider bg-[#123C3A] text-[#FCE9B0] hover:bg-[#1C4F52] cursor-pointer"
        >
          Launch Interactive 4-Ring Graph Workspace →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {COSTING_RINGS.map((ring) => {
          const ringModules = FEATURE_MODULES.filter((m) => m.ringId === ring.id);
          const ringFunctions = PLATFORM_FUNCTIONS.filter((f) => f.ringId === ring.id);

          return (
            <div
              key={ring.id}
              className={`p-5 rounded-lg border-2 flex flex-col justify-between ${
                ring.isRepeatableCycle
                  ? 'bg-[#F2EADB]/70 border-[#B5481A]'
                  : 'bg-[#F2EADB]/35 border-[#123C3A]/25'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono-tech text-xs font-semibold uppercase px-2.5 py-0.5 rounded bg-[#123C3A] text-[#FCE9B0]">
                    {ring.code}
                  </span>
                  {ring.isRepeatableCycle ? (
                    <span className="inline-flex items-center gap-1 font-mono-tech text-xs text-[#8A3410] font-semibold">
                      <RefreshCw className="w-3.5 h-3.5" /> Repeatable Expert Cycle
                    </span>
                  ) : (
                    <span className="font-mono-tech text-xs text-[#13302C]/70">
                      Sequential Package {ring.order}
                    </span>
                  )}
                </div>

                <h3 className="font-isrm-heading font-bold text-lg text-[#0B544C]">
                  {ring.title}
                </h3>
                <p className="text-sm text-[#13302C]/80 mt-1">{ring.subtitle}</p>

                {ring.isRepeatableCycle && ring.cycleDescription && (
                  <div className="mt-3 p-3 rounded bg-white border-l-4 border-[#B5481A] text-xs text-[#13302C] leading-relaxed">
                    {ring.cycleDescription}
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <div className="font-mono-tech text-xs uppercase text-[#123C3A] font-semibold">
                    Configurable Service Deck Functions ({ringFunctions.length}):
                  </div>
                  {ringFunctions.map((fn) => {
                    const active = fn.isFoundation || enabledFunctionIds.includes(fn.id);
                    return (
                      <div
                        key={fn.id}
                        className="flex items-start justify-between gap-2 p-2.5 rounded bg-white border border-[#123C3A]/15 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-[#13302C] flex items-center gap-1.5">
                            {fn.isFoundation ? (
                              <Lock className="w-3.5 h-3.5 text-[#0B544C] shrink-0" />
                            ) : (
                              <CheckCircle2
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  active ? 'text-[#0B544C]' : 'text-[#13302C]/30'
                                }`}
                              />
                            )}
                            <span>{fn.title}</span>
                          </div>
                          <p className="text-[#13302C]/75 mt-0.5">{fn.communityPerspective}</p>
                        </div>

                        {fn.isFoundation ? (
                          <span className="font-mono-tech text-[10px] px-2 py-0.5 rounded bg-[#123C3A]/10 text-[#123C3A] shrink-0">
                            MANDATORY BASE
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onToggleFunction(fn.id)}
                            className={`px-2.5 py-1 rounded font-mono-tech text-[10px] uppercase cursor-pointer shrink-0 ${
                              active
                                ? 'bg-[#0B544C] text-white font-semibold'
                                : 'bg-[#E9DEC9] text-[#13302C]'
                            }`}
                          >
                            {active ? 'Included' : 'Excluded'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#123C3A]/15 text-xs text-[#13302C]/75 font-mono-tech">
                Modules: {ringModules.map((m) => m.title).join(' · ')}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
