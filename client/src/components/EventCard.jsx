import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Code2 } from 'lucide-react';

const EventCard = ({ event, onViewRegistrations, onViewFeedback }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm border border-gray-200/60 dark:border-slate-700 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col h-full">
      <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
        {event.poster ? (
          <img src={event.poster} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-indigo-950 to-primary-950 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700">
            {/* Dark glass decorative blurs */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
            <Code2 className="h-12 w-12 text-primary-400 drop-shadow-[0_0_12px_rgba(59,130,246,0.5)] opacity-80" />
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-lg shadow-black/5 border border-white/20 dark:border-slate-700">
          {formattedDate}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col relative bg-white dark:bg-slate-800">
        <div className="flex items-center gap-2 mb-3">
          {event.club?.logo ? (
            <img src={event.club.logo} className="h-7 w-7 rounded-full object-cover shadow-sm bg-gray-50 dark:bg-slate-700 border border-gray-100 dark:border-slate-600" alt="Club Logo" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
              {event.club?.name ? event.club.name.charAt(0).toUpperCase() : 'C'}
            </div>
          )}
          <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">{event.club?.name || 'Unknown Hub'}</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors leading-tight">
          {event.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-300 mb-5 line-clamp-3 flex-grow font-medium leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4 mr-2 text-primary-500" />
            {event.time}
          </div>
          <div className="flex items-center text-xs font-semibold text-slate-600 dark:text-slate-400">
            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
            {event.venue}
          </div>
          {event.registrationCount !== undefined && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100/60 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Registrations: <span className="text-primary-600 text-xs ml-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">{event.registrationCount}</span>
              </span>
              <div className="flex gap-1.5 border border-slate-100 dark:border-slate-700 p-0.5 rounded-lg bg-white dark:bg-slate-800">
                {onViewRegistrations && (
                  <button 
                    onClick={() => onViewRegistrations(event)} 
                    className="text-[10px] font-bold text-primary-600 hover:text-white hover:bg-primary-600 px-2 py-1 rounded transition-colors"
                  >
                    Attendees
                  </button>
                )}
                {onViewFeedback && (
                  <button 
                    onClick={() => onViewFeedback(event)} 
                    className="text-[10px] font-bold text-amber-600 hover:text-white hover:bg-amber-600 px-2 py-1 rounded transition-colors"
                  >
                    Feedback
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          to={`/events/${event._id}`}
          className="w-full mt-6 bg-slate-50 dark:bg-slate-900 hover:bg-gradient-to-r hover:from-primary-600 hover:to-indigo-600 text-slate-700 dark:text-slate-300 hover:text-white border border-slate-200 dark:border-slate-700 hover:border-transparent py-2.5 rounded-xl text-sm font-bold transition-all duration-300 text-center block shadow-sm hover:shadow-md"
        >
          Access Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
