
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import { Camera, BarChart, UserPlus, Book } from 'lucide-react';

const HomePage = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            AI-Powered Class Attendance<br /> 
            <span className="text-brand-500">Made Simple</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-10 text-gray-600">
            Revolutionize your classroom attendance system with our facial recognition
            technology. Fast, accurate, and effortless tracking.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="bg-brand-500 hover:bg-brand-600 text-lg">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-lg">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose AttendAI?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge facial recognition with intuitive attendance management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Camera size={24} />}
              title="Fast Recognition"
              description="Identify students in seconds with our advanced facial recognition algorithm."
            />
            <FeatureCard
              icon={<BarChart size={24} />}
              title="Detailed Analytics"
              description="Track attendance patterns with comprehensive charts and reports."
            />
            <FeatureCard
              icon={<UserPlus size={24} />}
              title="Easy Management"
              description="Add students quickly and manage their profiles with a few clicks."
            />
            <FeatureCard
              icon={<Book size={24} />}
              title="Class Integration"
              description="Organize students by classes and courses for better management."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From setup to daily use, our platform makes attendance tracking effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Register Students</h3>
              <p className="text-gray-600">Add student profiles with photos for facial recognition training.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Take Attendance</h3>
              <p className="text-gray-600">Students scan their faces on a camera or device at class start.</p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">View Reports</h3>
              <p className="text-gray-600">Access detailed attendance reports and insights on the dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-500 py-16 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Classroom?</h2>
          <p className="text-xl text-white opacity-90 max-w-2xl mx-auto mb-10">
            Join educators worldwide who are saving time and improving accuracy with AttendAI.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" variant="default" className="bg-white hover:bg-gray-100 text-brand-600 text-lg">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-brand-600 text-lg">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
